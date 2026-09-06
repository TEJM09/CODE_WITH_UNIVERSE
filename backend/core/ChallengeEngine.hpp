#ifndef CHALLENGE_ENGINE_HPP
#define CHALLENGE_ENGINE_HPP

#include "../models/Challenge.hpp"
#include <string>
#include <vector>
#include <regex>
#include <algorithm>
#include <sstream>
#include <iostream>

struct EvaluationResult {
    bool success = false;
    std::string stdoutOutput;
    std::string stderrOutput;
    std::string statusMessage;
    int testsPassed = 0;
    int totalTests = 1;
    double executionTimeMs = 0.0;
    int damageDealt = 0;
    bool bossDefeated = false;
};

class ChallengeEngine {
public:
    ChallengeEngine() = default;

    // Static helper to normalize whitespace for output comparison
    static std::string normalizeOutput(const std::string& str) {
        std::string result;
        std::stringstream ss(str);
        std::string line;
        while (std::getline(ss, line)) {
            // Trim leading and trailing spaces
            size_t start = line.find_first_not_of(" \t\r\n");
            size_t end = line.find_last_not_of(" \t\r\n");
            if (start != std::string::npos && end != std::string::npos) {
                if (!result.empty()) result += "\n";
                result += line.substr(start, end - start + 1);
            }
        }
        return result;
    }

    // Evaluates output against expected solution output
    EvaluationResult evaluate(const std::string& userOutput, const std::string& expectedOutput,
                             const std::string& compileErrors = "", int enemyMaxHp = 100) {
        EvaluationResult res;
        res.totalTests = 1;

        if (!compileErrors.empty()) {
            res.success = false;
            res.stderrOutput = compileErrors;
            res.statusMessage = "Compilation / Syntax Error in C++ code";
            res.testsPassed = 0;
            res.damageDealt = 0;
            return res;
        }

        std::string normUser = normalizeOutput(userOutput);
        std::string normExpected = normalizeOutput(expectedOutput);

        res.stdoutOutput = userOutput;

        if (normUser == normExpected || (normUser.find(normExpected) != std::string::npos && !normExpected.empty())) {
            res.success = true;
            res.testsPassed = 1;
            res.statusMessage = "All Test Cases Passed! Critical Strike Landed!";
            res.damageDealt = enemyMaxHp; // Full critical damage on correct code
            res.bossDefeated = true;
        } else {
            res.success = false;
            res.testsPassed = 0;
            res.statusMessage = "Output Mismatch. Expected: '" + normExpected + "' | Got: '" + normUser + "'";
            res.damageDealt = std::max(10, enemyMaxHp / 4); // Partial damage for trying
        }

        return res;
    }
};

#endif // CHALLENGE_ENGINE_HPP
