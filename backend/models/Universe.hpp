#ifndef UNIVERSE_HPP
#define UNIVERSE_HPP

#include "Level.hpp"
#include <string>
#include <vector>
#include <memory>

class Universe {
private:
    std::string id;
    std::string name;
    std::string subtitle;
    std::string topic;
    int order;
    std::string color;
    std::string accentColor;
    std::string icon;
    std::string bgImage;
    std::string description;
    std::vector<Level> levels;

public:
    Universe() = default;
    Universe(const std::string& id, const std::string& name, const std::string& subtitle,
             const std::string& topic, int order, const std::string& color,
             const std::string& accentColor, const std::string& icon,
             const std::string& bgImage, const std::string& description)
        : id(id), name(name), subtitle(subtitle), topic(topic), order(order),
          color(color), accentColor(accentColor), icon(icon),
          bgImage(bgImage), description(description) {}

    void addLevel(const Level& lvl) {
        levels.push_back(lvl);
    }

    // Getters
    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getSubtitle() const { return subtitle; }
    std::string getTopic() const { return topic; }
    int getOrder() const { return order; }
    std::string getColor() const { return color; }
    std::string getAccentColor() const { return accentColor; }
    std::string getIcon() const { return icon; }
    std::string getBgImage() const { return bgImage; }
    std::string getDescription() const { return description; }
    const std::vector<Level>& getLevels() const { return levels; }

    const Level* findLevel(const std::string& levelId) const {
        for (const auto& lvl : levels) {
            if (lvl.getId() == levelId) return &lvl;
        }
        return nullptr;
    }
};

#endif // UNIVERSE_HPP
