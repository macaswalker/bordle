# Bordle

Bordle is a CLI-based (for now) geography game built in Python. I built this in an evening because I wanted to see if I could.

You get dropped in a random country, and your goal is to travel as far as you can by naming neighboring countries.

## How to Play
Run the script. You'll be greeted by the title screen and dropped into a random starting country.

Expand your territory. Type the name of a country that shares a land border with any of the countries you have currently collected.

Note: You don't just have to move in a line! If you started in France and moved to Spain, your next move could be Portugal (bordering Spain) OR Germany (bordering France).

Watch your lives. You have 3 lives.

✅ Correct: The country is added to your list, score goes up.

❌ Incorrect: You lose a life.

Game Over. When you run out of lives, the game ends. It will show you your final score, the time elapsed, and a list of all the countries you could have chosen.

## Installation & Usage

No external libraries required! This uses standard Python libraries (random, time).

Clone the repo or download the files.

Run the game:

```
python game.py
```

## Project Structure

game.py: The main game loop. Handles the logic, input validation, scoring, and the timer.

borders.py: The database. A dictionary containing adjacency lists for countries with land borders. (Copied from [here](https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_number_of_land_borders) with some minor amendments).

helpers.py: Just holds the ASCII art title.

## A Note on Islands
If you look at the code, you'll see an islands dictionary in borders.py (Australia, Japan, etc.). Currently, they are excluded from the main game logic. This may change in the future...


# Future Ideas
- Add difficulty modes (Hardcore: 1 life).

- Add a "hint" system.

- Figure out how to handle island hopping.

- Move this from CLI to something a bit nicer 
