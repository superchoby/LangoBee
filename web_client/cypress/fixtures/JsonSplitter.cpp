#include <fstream>
#include <iostream>
#include "json/json.h"

void split_json_array(const std::string &input_file, const std::string &output_pattern, int chunk_size) {
    std::ifstream file(input_file);
    Json::Value root;
    file >> root;
    file.close();

    int num_chunks = (root.size() + chunk_size - 1) / chunk_size;
    for (int chunk_index = 0; chunk_index < num_chunks; ++chunk_index) {
        Json::Value chunk(Json::arrayValue);
        for (int i = chunk_index * chunk_size; i < (chunk_index + 1) * chunk_size && i < root.size(); ++i) {
            chunk.append(root[i]);
        }

        std::string output_file = output_pattern + std::to_string(chunk_index) + ".json";
        std::ofstream out_file(output_file);
        out_file << chunk;
        out_file.close();
    }
}

// clang++ -std=c++11 JsonSplitter.cpp -o JsonSplitter -ljsoncpp

int main() {
    std::string input_file = "updated_data.json";
    std::string output_pattern = "SplitUpdatedDataFixtures/fixture_";
    int chunk_size = 15000;

    split_json_array(input_file, output_pattern, chunk_size);

    return 0;
}
