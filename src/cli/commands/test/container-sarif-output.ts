import * as sarif from 'sarif';
const upperFirst = require('lodash.upperfirst');

export function createSarifOutputForContainers(testResult): sarif.Log {
  const sarifRes: sarif.Log = {
    version: '2.1.0',
    runs: [],
  };

  testResult.forEach((testResult) => {
    sarifRes.runs.push({
      tool: getTool(testResult),
      results: getResults(testResult),
    });
  });

  return sarifRes;
}

export function getTool(testResult): sarif.Tool {
  const tool: sarif.Tool = {
    driver: {
      name: 'Snyk Container',
      rules: [],
    },
  };

  if (!testResult.vulnerabilities) {
    return tool;
  }

  const pushedIds = {};
  tool.driver.rules = testResult.vulnerabilities
    .map((vuln) => {
      if (pushedIds[vuln.id]) {
        return;
      }
      const level = vuln.severity === 'high' ? 'error' : 'warning';
      const cve = vuln['identifiers']['CVE'][0];
      pushedIds[vuln.id] = true;
      return {
        id: vuln.id,
        shortDescription: {
          text: `${upperFirst(vuln.severity)} severity - ${
            vuln.title
          } vulnerability in ${vuln.packageName}`,
        },
        fullDescription: {
          text: cve
            ? `(${cve}) ${vuln.name}@${vuln.version}`
            : `${vuln.name}@${vuln.version}`,
        },
        help: {
          text: '',
          markdown: vuln.description,
        },
        defaultConfiguration: {
          level: level,
        },
        properties: {
          tags: ['security', ...vuln.identifiers.CWE],
        },
      };
    })
    .filter(Boolean);
  return tool;
}

export function getResults(testResult): sarif.Result[] {
  const results: sarif.Result[] = [];

  if (!testResult.vulnerabilities) {
    return results;
  }
  testResult.vulnerabilities.forEach((vuln) => {
    results.push(getSarifResult(vuln, testResult.displayTargetFile));
  });
  return results;
}

export function getSarifResult(
  vuln,
  targetFile: string | undefined,
): sarif.Result {
  const result: sarif.Result = {
    ruleId: vuln.id,
    message: {
      text: `This file introduces a vulnerable ${vuln.packageName} package with a ${vuln.severity} severity vulnerability.`,
    },
  };
  if (targetFile) {
    result.locations = [
      {
        physicalLocation: {
          artifactLocation: {
            uri: targetFile,
          },
          region: {
            startLine: vuln.lineNumber || 1,
          },
        },
      },
    ];
  }
  return result;
}