# game.py

from borders import borders
from helpers import print_title
import time

import random

if __name__== "__main__":

    print_title()

    print()

    print("Welcome to Bordle! You have been dropped in a random country... your job is to travel around the world! You have three lives. Your job is to travel between different countries using only land borders. If you answer incorrectly, you will lose a life. You can select any country that borders any of the countries you have previously successfully selected!")

    num_countries = len(borders)

    start_country = random.choice(list(borders.keys()))

    lives = 3

    score = 0

    country_list = [start_country]

    print()

    print(f"You have landed in {start_country}, you have {lives} lives")

    start_time = time.time()

    while lives > 0:

        user_answer = input(f"Enter a country that borders \n{', '.join(country_list)}: \n").strip()

        if user_answer in country_list:

            print("You have already selected this country!")
            print()

            continue

        if any(user_answer in borders[country] for country in country_list):

            country_list.append(user_answer)

            score += 1 

            print(f"{user_answer} is correct! You have {lives} lives and a score of {score}")
            print()

        else:

            lives -= 1

            print(f"{user_answer} is incorrect! You have {lives} lives and a score of {score}")
            print()

    time_elapsed = time.time() - start_time

    minutes = int(time_elapsed // 60)
    seconds = int(time_elapsed % 60)

    valid_options = sorted({neigh 
                        for c in country_list 
                        for neigh in borders[c] 
                        if neigh not in country_list})
    
    valid_options = ', '.join(valid_options)


    print()
    print(f"Game over! You successfully guessed {score} countries.")
    print(f"Your final contiguous list of countries is {', '.join(country_list)}.")
    print(f"You could have selected: {valid_options}")
    print(f"Game time: {minutes}m {seconds}s")