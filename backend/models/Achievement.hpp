#ifndef ACHIEVEMENT_HPP
#define ACHIEVEMENT_HPP

#include <string>
#include <vector>
#include <algorithm>

class Achievement {
private:
    std::string id;
    std::string title;
    std::string description;
    std::string category;
    std::string icon;
    int xpReward;
    int coinReward;
    std::vector<std::string> unlockedUsers;

public:
    Achievement() = default;
    Achievement(const std::string& id, const std::string& title, const std::string& description,
                const std::string& category, const std::string& icon, int xpReward, int coinReward)
        : id(id), title(title), description(description), category(category),
          icon(icon), xpReward(xpReward), coinReward(coinReward) {}

    std::string getId() const { return id; }
    std::string getTitle() const { return title; }
    std::string getDescription() const { return description; }
    std::string getCategory() const { return category; }
    std::string getIcon() const { return icon; }
    int getXpReward() const { return xpReward; }
    int getCoinReward() const { return coinReward; }
    const std::vector<std::string>& getUnlockedUsers() const { return unlockedUsers; }

    bool isUnlockedBy(const std::string& userId) const {
        return std::find(unlockedUsers.begin(), unlockedUsers.end(), userId) != unlockedUsers.end();
    }

    void unlockForUser(const std::string& userId) {
        if (!isUnlockedBy(userId)) {
            unlockedUsers.push_back(userId);
        }
    }

    void setUnlockedUsers(const std::vector<std::string>& users) {
        unlockedUsers = users;
    }
};

#endif // ACHIEVEMENT_HPP
