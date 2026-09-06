#ifndef REWARD_HPP
#define REWARD_HPP

#include <string>

class Reward {
private:
    int xp;
    int coins;
    std::string item;

public:
    Reward(int xp = 0, int coins = 0, const std::string& item = "")
        : xp(xp), coins(coins), item(item) {}

    int getXp() const { return xp; }
    int getCoins() const { return coins; }
    std::string getItem() const { return item; }

    void setXp(int x) { xp = x; }
    void setCoins(int c) { coins = c; }
    void setItem(const std::string& i) { item = i; }
};

#endif // REWARD_HPP
