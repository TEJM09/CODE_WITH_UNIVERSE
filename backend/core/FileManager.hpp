#ifndef FILE_MANAGER_HPP
#define FILE_MANAGER_HPP

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <stdexcept>
#include <vector>

class StorageException : public std::runtime_error {
public:
    explicit StorageException(const std::string& message) : std::runtime_error("Storage Error: " + message) {}
};

class FileManager {
private:
    std::string basePath;

public:
    explicit FileManager(const std::string& base = "data/") : basePath(base) {
        if (!basePath.empty() && basePath.back() != '/') {
            basePath += '/';
        }
    }

    // Template function demonstrating C++ templates in core architecture
    template <typename T>
    static void logOperation(const std::string& opName, const T& data) {
        std::cout << "[FileManager] " << opName << " => " << data << std::endl;
    }

    std::string readFile(const std::string& filename) const {
        std::string fullPath = basePath + filename;
        std::ifstream file(fullPath);
        if (!file.is_open()) {
            // Try relative without basePath if already contains data/
            std::ifstream altFile(filename);
            if (altFile.is_open()) {
                std::stringstream buffer;
                buffer << altFile.rdbuf();
                return buffer.str();
            }
            throw StorageException("Could not open file for reading: " + fullPath);
        }
        std::stringstream buffer;
        buffer << file.rdbuf();
        return buffer.str();
    }

    bool writeFile(const std::string& filename, const std::string& content) const {
        std::string fullPath = basePath + filename;
        std::ofstream file(fullPath, std::ios::trunc);
        if (!file.is_open()) {
            std::ofstream altFile(filename, std::ios::trunc);
            if (altFile.is_open()) {
                altFile << content;
                return true;
            }
            throw StorageException("Could not open file for writing: " + fullPath);
        }
        file << content;
        file.close();
        return true;
    }

    bool fileExists(const std::string& filename) const {
        std::string fullPath = basePath + filename;
        std::ifstream file(fullPath);
        return file.good();
    }
};

#endif // FILE_MANAGER_HPP
