import json
import sys

# Check if a JSON file name is provided as a command-line argument
if len(sys.argv) != 2:
    print("Usage: python generate_requires.py <json_file_name>")
    sys.exit(1)

# Get the JSON file name from the command-line argument
json_file_name = sys.argv[1]

# Load the input JSON data
try:
    with open(json_file_name, 'r') as file:
        input_json = json.load(file)
except FileNotFoundError:
    print(f"File '{json_file_name}' not found.")
    sys.exit(1)

# Define a template for generating the 'require' statements
template = """\
const {variable_name} = require("{fileFullPath}");
"""

# Create a dictionary to store the variable names and file full paths
require_statements = {}

# Iterate over each game in the input JSON
for game in input_json:
    # Iterate over each card in the game
    for card in game["gameCards"]:
        variable_name = card["name"]
        require_statements[variable_name] = card["fileFullPath"]

# Write the 'require' statements to the output file
with open("import_requires.js", 'w') as output_file:
    output_file.write('// Generated require statements\n')
    for variable_name, fileFullPath in require_statements.items():
        require_statement = template.format(variable_name=variable_name, fileFullPath=fileFullPath)
        output_file.write(require_statement)

    # Write the corresponding arrays to the output file
    output_file.write('\n\n')
    output_file.write('// Arrays\n')
    for game in input_json:
        game_name = game["gameName"]
        card_names = [card["name"] for card in game["gameCards"]]
        array_declaration = f'const {game_name}Cards = [{", ".join(card_names)}];\n'
        output_file.write(array_declaration)

print(f"Generated 'require' statements and arrays written to import_requires.js")
