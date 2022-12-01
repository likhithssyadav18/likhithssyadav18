# Homework #3: Webbing the chart

The purpose of this homework is to teach you some building blocks and functionalities contained in D3.js:
By the end of this assignment you should be able to:

- Loading a dataset.
- Performing DOM selection.
- Filtering data attributes.
- Dynamically update visualized attributes.
- Using the D3 domain, range, and scale functions.
- Plot values in a spider chart along various axes.
- Add a tooltip.
- How to create another visualization within a tooltip based on user interactions.
- Usage of mouse-event interactions.


The GIF below shows an example of what your finished interface will look like.

![images/interface.mp4](images/interface.mp4)

## Overview

The starter code for this assignment shows four panels on the `index.html` page. 
The top panel contains two `select` html elements and a `submit` button. 
The user can select pokemon types(type-1 and type-2) from the list and then click the button. 
This should create spider charts in the four panels present. 
The spider chart will visualize the median of values from the statistics of the selected pokemons based on their type (i.e., HP, Attack, Defense, Special Attack, Special Defense and Speed are the attributes which are represented as the axes in the chart).
Clicking a area under the spider chart will show a tooltip where it displays the count of the selected pokemons in every region in a bar chart. 


## Data Description

This assignment uses a csv file in the main branch: Pokemon_Database.csv. 
This file consists of 905 different pokemons which are present across 8 generations(from Kanto to Galar and Hisui), with the game statistics of each pokemon being recorded.
Attributes like HP, Attack, Defense, Special Attack, Special Defense and Speed are present in this dataset along with class labels like Generation, Type1, Type2, Category, Mega_Evolution_Flag, Region_Forme.

## To complete the assignment

- Clone this code template to your local machine.
- Start a local server and open the `index.html` page.
- Modify the given code according to the instructions below to achieve the requested interface.
- Commit and push the code back to this repository to submit it.

## Step 0: Starting code

When you first run the page, you should see the empty interface. Add your name and email to the top. It's up to you if you want to write your JavaScript code in a separate JS file, or in the main `index.html` file.
