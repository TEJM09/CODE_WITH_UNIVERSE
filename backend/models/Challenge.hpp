#ifndef CHALLENGE_HPP
#define CHALLENGE_HPP

#include <string>
#include <vector>

struct TestCase {
    std::string input;
    std::string expectedOutput;
    bool isHidden = false;
};

class Challenge {
private:
    std::string id;
    std::string title;
    std::string prompt;
    std::string starterCode;
    std::string solutionSample;
    std::string expectedOutput;
    std::vector<std::string> hints;
    std::vector<TestCase> testCases;

public:
    Challenge() = default;
    Challenge(const std::string& id, const std::string& title, const std::string& prompt,
              const std::string& starterCode, const std::string& solutionSample,
              const std::string& expectedOutput, const std::vector<std::string>& hints = {})
        : id(id), title(title), prompt(prompt), starterCode(starterCode),
          solutionSample(solutionSample), expectedOutput(expectedOutput), hints(hints) {}

    // Getters
    std::string getId() const { return id; }
    std::string getTitle() const { return title; }
    std::string getPrompt() const { return prompt; }
    std::string getStarterCode() const { return starterCode; }
    std::string getSolutionSample() const { return solutionSample; }
    std::string getExpectedOutput() const { return expectedOutput; }
    const std::vector<std::string>& getHints() const { return hints; }
    const std::vector<TestCase>& getTestCases() const { return testCases; }

    void addTestCase(const std::string& in, const std::string& out, bool hidden = false) {
        testCases.push_back({in, out, hidden});
    }

    void addHint(const std::string& h) {
        hints.push_back(h);
    }
};

#endif // CHALLENGE_HPP
