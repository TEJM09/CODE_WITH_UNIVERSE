#ifndef PLAYER_HPP
#define PLAYER_HPP

#include "User.hpp"
#include <vector>
#include <string>
#include <cmath>

struct PlayerStats {
    int challengesSolved = 0;
    int bossesDefeated = 0;
    int accuracyRate = 100;
    int streakDays = 1;
    int codeLinesWritten = 0;
};

class Player : public User {
private:
    int level = 1;
    int xp = 0;
    int xpToNextLevel = 500;
    int coins = 100;
    int lives = 5;
    int maxLives = 5;
    std::string currentUniverseId = "world_1";
    std::vector<std::string> unlockedUniverses;
    std::vector<std::string> completedUniverses;
    std::vector<std::string> completedLevels;
    int restorationPercentage = 0;
    PlayerStats stats;
    std::string lastActive;

public:
    // Constructors
    Player() : User() {
        unlockedUniverses.push_back("world_1");
    }

    Player(const User& baseUser, int lvl = 1, int currentXp = 0, int currentCoins = 100)
        : User(baseUser.getId(), baseUser.getUsername(), baseUser.getEmail(),
               baseUser.getPasswordHash(), baseUser.getAvatar(), baseUser.getCreatedAt()),
          level(lvl), xp(currentXp), coins(currentCoins) {
        unlockedUniverses.push_back("world_1");
        calculateXpToNextLevel();
    }

    virtual ~Player() override = default;

    // XP and Level Calculation using mathematical formula
    void addXp(int amount) {
        xp += amount;
        while (xp >= xpToNextLevel) {
            levelUp();
        }
    }

    void addCoins(int amount) {
        coins += amount;
    }

    void spendCoins(int amount) {
        if (coins >= amount) {
            coins -= amount;
        }
    }

    void loseLife() {
        if (lives > 0) lives--;
    }

    void restoreLife(int amount = 1) {
        lives = std::min(maxLives, lives + amount);
    }

    void levelUp() {
        level++;
        coins += 50 * level; // Level-up bonus
        calculateXpToNextLevel();
    }

    void calculateXpToNextLevel() {
        // Base formula: 500 * (level ^ 1.35)
        xpToNextLevel = static_cast<int>(500 * std::pow(level, 1.35));
    }

    // Getters & Setters
    int getLevel() const { return level; }
    int getXp() const { return xp; }
    int getXpToNextLevel() const { return xpToNextLevel; }
    int getCoins() const { return coins; }
    int getLives() const { return lives; }
    int getMaxLives() const { return maxLives; }
    std::string getCurrentUniverseId() const { return currentUniverseId; }
    const std::vector<std::string>& getUnlockedUniverses() const { return unlockedUniverses; }
    const std::vector<std::string>& getCompletedUniverses() const { return completedUniverses; }
    const std::vector<std::string>& getCompletedLevels() const { return completedLevels; }
    int getRestorationPercentage() const { return restorationPercentage; }
    const PlayerStats& getStats() const { return stats; }
    std::string getLastActive() const { return lastActive; }

    void setLevel(int l) { level = l; calculateXpToNextLevel(); }
    void setXp(int x) { xp = x; }
    void setCoins(int c) { coins = c; }
    void setLives(int liv) { lives = liv; }
    void setCurrentUniverseId(const std::string& uId) { currentUniverseId = uId; }
    void setRestorationPercentage(int r) { restorationPercentage = r; }
    void setStats(const PlayerStats& s) { stats = s; }
    void setLastActive(const std::string& la) { lastActive = la; }

    void unlockUniverse(const std::string& universeId) {
        for (const auto& id : unlockedUniverses) {
            if (id == universeId) return;
        }
        unlockedUniverses.push_back(universeId);
    }

    void completeUniverse(const std::string& universeId) {
        for (const auto& id : completedUniverses) {
            if (id == universeId) return;
        }
        completedUniverses.push_back(universeId);
    }

    void completeLevel(const std::string& levelId) {
        for (const auto& id : completedLevels) {
            if (id == levelId) return;
        }
        completedLevels.push_back(levelId);
        stats.challengesSolved++;
        stats.codeLinesWritten += 15;
    }

    void setUnlockedUniverses(const std::vector<std::string>& list) { unlockedUniverses = list; }
    void setCompletedUniverses(const std::vector<std::string>& list) { completedUniverses = list; }
    void setCompletedLevels(const std::vector<std::string>& list) { completedLevels = list; }
};

#endif // PLAYER_HPP
