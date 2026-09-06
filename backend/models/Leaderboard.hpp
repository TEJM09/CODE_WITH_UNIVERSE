#ifndef LEADERBOARD_HPP
#define LEADERBOARD_HPP

#include "Player.hpp"
#include <string>
#include <vector>
#include <algorithm>

struct LeaderboardEntry {
    int rank = 0;
    std::string userId;
    std::string username;
    std::string avatar;
    int level = 1;
    int xp = 0;
    int coins = 0;
    int restorationPercentage = 0;
    std::string badge;
    std::string status = "online";
};

class Leaderboard {
private:
    std::vector<LeaderboardEntry> entries;

public:
    Leaderboard() = default;

    void addOrUpdateEntry(const LeaderboardEntry& entry) {
        bool found = false;
        for (auto& e : entries) {
            if (e.userId == entry.userId) {
                e = entry;
                found = true;
                break;
            }
        }
        if (!found) {
            entries.push_back(entry);
        }
        sortAndRank();
    }

    void sortAndRank() {
        // Sort by XP descending, then restoration percentage descending
        std::sort(entries.begin(), entries.end(), [](const LeaderboardEntry& a, const LeaderboardEntry& b) {
            if (a.xp != b.xp) return a.xp > b.xp;
            return a.restorationPercentage > b.restorationPercentage;
        });

        // Reassign ranks and badges
        for (size_t i = 0; i < entries.size(); i++) {
            entries[i].rank = static_cast<int>(i + 1);
            if (entries[i].rank == 1) entries[i].badge = "Grand Compiler Master";
            else if (entries[i].rank == 2) entries[i].badge = "Polymorph Paladin";
            else if (entries[i].rank == 3) entries[i].badge = "Syntax Adept";
            else if (entries[i].rank <= 5) entries[i].badge = "STL Vanguard";
            else entries[i].badge = "Code Guardian";
        }
    }

    const std::vector<LeaderboardEntry>& getEntries() const { return entries; }
    void setEntries(const std::vector<LeaderboardEntry>& newEntries) {
        entries = newEntries;
        sortAndRank();
    }
};

#endif // LEADERBOARD_HPP
