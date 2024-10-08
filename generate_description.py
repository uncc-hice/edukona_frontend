import json
from openai import OpenAI


def main():
    # Get API key from input (passed as an argument)
    import sys

    api_key = sys.argv[1]

    # Initialize the OpenAI client
    client = OpenAI(api_key=api_key)

    # Read the content of the diff file
    with open("diff.txt", "r") as file:
        diff_content = file.read()

    # Filter out changes to package.json and package-lock.json
    filtered_diff = filter_out_files(diff_content, ["package.json", "package-lock.json"])

    content = (
        f"Provide a PR description (be elaborate and have bullet points or an itemized "
        f"list for the changes made) as JSON with keys 'title' (value is string markdown) "
        f"and 'description' (value is string in markdown), given this diff:\n"
        f"{filtered_diff}."
    )

    # Generate the completion
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "user", "content": content},
        ],
    )

    # Get the response and parse it
    result = completion.choices[0].message.content
    result_dictionary = json.loads(result)

    # Write the response to a file
    with open("description.txt", "w") as file:
        file.write(result_dictionary["description"])

    with open("title.txt", "w") as file:
        file.write(result_dictionary["title"])


def filter_out_files(diff_content, file_names):
    """
    Filters out changes related to specific files in the diff.

    Parameters:
    - diff_content: str, the content of the diff
    - file_names: list of strings, file names to filter out from the diff

    Returns:
    - str, the filtered diff content
    """
    filtered_lines = []
    skip_file = False

    for line in diff_content.splitlines():
        # Check if the line contains a file name to skip
        if any(file_name in line for file_name in file_names):
            skip_file = True
        elif line.startswith("diff "):  # New file diff starting
            skip_file = False

        if not skip_file:
            filtered_lines.append(line)

    return "\n".join(filtered_lines)


if __name__ == "__main__":
    main()
