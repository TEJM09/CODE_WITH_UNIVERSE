#ifndef GAME_ENGINE_HPP
#define GAME_ENGINE_HPP

#include "../models/User.hpp"
#include "../models/Player.hpp"
#include "../models/Universe.hpp"
#include "../models/Achievement.hpp"
#include "../models/Leaderboard.hpp"
#include "FileManager.hpp"
#include "AuthManager.hpp"
#include "ChallengeEngine.hpp"

#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <queue>
#include <stack>
#include <memory>
#include <iostream>
#include <sstream>

class GameEngineException : public std::runtime_error {
public:
    explicit GameEngineException(const std::string& msg) : std::runtime_error("GameEngine Error: " + msg) {}
};

class GameEngine {
private:
    FileManager fileManager;
    AuthManager authManager;
    ChallengeEngine challengeEngine;

    // STL Containers demonstrating real C++ data structure usage
    std::map<std::string, Universe> universesMap; // Ordered map for universe progression
    std::unordered_map<std::string, Player> playersMap; // Fast player lookup
    std::vector<Achievement> achievementsList;
    Leaderboard leaderboard;

    // STL Queue for Mission / Action processing
    std::queue<std::string> pendingActionQueue;

    // STL Stack for Universe Navigation History (allows backtrack / travel log)
    std::stack<std::string> universeTravelHistory;

public:
    explicit GameEngine(const std::string& dataDir = "data/")
        : fileManager(dataDir), authManager(fileManager) {
        initEngine();
    }

    void initEngine() {
        // Log startup using template logger
        FileManager::logOperation("GameEngine", "Initializing CodeWithUniverse C++ Core");
    }

    // Accessors
    AuthManager& getAuthManager() { return authManager; }
    ChallengeEngine& getChallengeEngine() { return challengeEngine; }
    FileManager& getFileManager() { return fileManager; }
    Leaderboard& getLeaderboard() { return leaderboard; }
    const std::map<std::string, Universe>& getUniverses() const { return universesMap; }
    const std::vector<Achievement>& getAchievements() const { return achievementsList; }

    void addUniverse(const Universe& u) {
        universesMap[u.getId()] = u;
    }

    void addPlayer(const Player& p) {
        playersMap[p.getId()] = p;
    }

    Player* getPlayer(const std::string& userId) {
        auto it = playersMap.find(userId);
        if (it != playersMap.end()) {
            return &(it->second);
        }
        return nullptr;
    }

    // Navigation using STL stack
    void travelToUniverse(Player& player, const std::string& universeId) {
        universeTravelHistory.push(player.getCurrentUniverseId());
        player.setCurrentUniverseId(universeId);
    }

    std::string getPreviousUniverse() {
        if (!universeTravelHistory.empty()) {
            std::string prev = universeTravelHistory.top();
            universeTravelHistory.pop();
            return prev;
        }
        return "world_1";
    }

    // Process Level Victory
    struct VictoryReport {
        int xpEarned;
        int coinsEarned;
        int newLevel;
        bool leveledUp;
        bool universeRestored;
        std::string unlockedUniverseId;
        std::vector<std::string> unlockedAchievements;
    };

    VictoryReport completeLevelForPlayer(const std::string& userId, const std::string& levelId, int xpReward, int coinReward) {
        Player* player = getPlayer(userId);
        if (!player) {
            throw GameEngineException("Player not found for level completion: " + userId);
        }

        int prevLevel = player->getLevel();
        player->completeLevel(levelId);
        player->addXp(xpReward);
        player->addCoins(coinReward);

        VictoryReport report;
        report.xpEarned = xpReward;
        report.coinsEarned = coinReward;
        report.newLevel = player->getLevel();
        report.leveledUp = (player->getLevel() > prevLevel);
        report.universeRestored = false;

        // Check if universe completed
        // For world_1 (3 levels w1_l1, w1_l2, w1_l3), if w1_l3 is completed, restore world_1 and unlock world_2
        if (levelId.find("_l3") != std::string::npos) {
            // Boss beaten
            player->getStats(); // update boss count
            PlayerStats stats = player->getStats();
            stats.bossesDefeated++;
            player->setStats(stats);

            // Determine universe
            std::string uId = player->getCurrentUniverseId();
            player->completeUniverse(uId);
            report.universeRestored = true;

            // Unlock next universe in order
            int currentNum = 1;
            if (uId.length() >= 7) {
                currentNum = std::stoi(uId.substr(6));
            }
            if (currentNum < 8) {
                std::string nextU = "world_" + std::to_string(currentNum + 1);
                player->unlockUniverse(nextU);
                report.unlockedUniverseId = nextU;
            }
        }

        // Calculate restoration percentage across 8 universes
        int totalLevelsCompleted = player->getCompletedLevels().size();
        int restoration = std::min(100, static_cast<int>((totalLevelsCompleted / 24.0) * 100));
        player->setRestorationPercentage(restoration);

        // Update leaderboard
        LeaderboardEntry entry;
        entry.userId = player->getId();
        entry.username = player->getUsername();
        entry.avatar = player->getAvatar();
        entry.level = player->getLevel();
        entry.xp = player->getXp();
        entry.coins = player->getCoins();
        entry.restorationPercentage = player->getRestorationPercentage();
        leaderboard.addOrUpdateEntry(entry);

        // Check achievements
        for (auto& ach : achievementsList) {
            if (!ach.isUnlockedBy(userId)) {
                bool shouldUnlock = false;
                if (ach.getId() == "ach_first_blood" && totalLevelsCompleted >= 1) shouldUnlock = true;
                if (ach.getId() == "ach_function_nexus" && totalLevelsCompleted >= 6) shouldUnlock = true;
                if (ach.getId() == "ach_oop_architect" && totalLevelsCompleted >= 9) shouldUnlock = true;
                if (ach.getId() == "ach_pointer_slayer" && levelId == "w6_l3") shouldUnlock = true;
                if (ach.getId() == "ach_flawless_compiler" && restoration >= 100) shouldUnlock = true;

                if (shouldUnlock) {
                    ach.unlockForUser(userId);
                    player->addXp(ach.getXpReward());
                    player->addCoins(ach.getCoinReward());
                    report.unlockedAchievements.push_back(ach.getTitle());
                }
            }
        }

        return report;
    }
};

#endif // GAME_ENGINE_HPP
