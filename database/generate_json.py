import sys
import json

# Check if the correct number of command-line arguments are provided
if len(sys.argv) != 3:
    print("Usage: python generate_json.py <input_text_file> <output_json_file>")
    sys.exit(1)

# Get the input text file name and output JSON file name from command-line arguments
input_text_file = sys.argv[1]
output_json_file = sys.argv[2]

# Read the lines from the input text file
with open(input_text_file, 'r') as text_file:
    lines = text_file.read().splitlines()

# Define a function to generate a card dictionary
def generate_card(id, name, fileFullPath, text1, text2):
    return {
        "id": str(id),
        "name": name,
        "fileFolder": "../assets/textures/calm_1/png",
        "fileFullPath": fileFullPath,
        "fileNameWithSufix": fileFullPath.split("/")[-1],
        "background": "red",
        "text1": text1,
        "text2": text2,
        "faceType": "back"
    }

# Define the game information
game_info = {
    "gameName": "Calm-1",
    "id": 0,
    "gameCards": [
        generate_card(1, "calm1", "../assets/textures/calm_1/png/calm1.png", lines[0], lines[1]),
        generate_card(2, "calm2", "../assets/textures/calm_1/png/calm2.png", lines[2], lines[3]),
        generate_card(3, "calm3", "../assets/textures/calm_1/png/calm3.png", lines[4], lines[5]),
        generate_card(4, "calm4", "../assets/textures/calm_1/png/calm4.png", lines[6], lines[7]),
        generate_card(5, "calm5", "../assets/textures/calm_1/png/calm5.png", lines[8], lines[9]),
		generate_card(6, "calm6", "../assets/textures/calm_1/png/calm6.png", lines[10], lines[11]),
		generate_card(7, "calm7", "../assets/textures/calm_1/png/calm7.png", lines[12], lines[13])
    ]
}

# Write the game information to the output JSON file
with open(output_json_file, 'w') as json_file:
    json.dump([game_info], json_file, ensure_ascii=False, indent=3)

print(f"Generated JSON file '{output_json_file}'")
