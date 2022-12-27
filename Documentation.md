# Elden Ring AR Calculator
In this file you'll see my thought process throught the project, where I got stuck and what I learnt from it. I don't know how well this is written. 
---
### Known Bugs
- ~~No 99 cap for the levels~~
- ~~Can go below base level~~
- ~~Other buttons didn't  respond 'cos setState didn't update properly~~ Reason for it not working was 'cos I set the initClass to currentClass since that one hasn't updated yet it will lead to async updates for initClass state.
- ~~Input lower than current is added not subtracted (fix this first)~~
- ~~Button up and down changes input field, but having entered a value doesn't change the input field.~~ Works as intended, you can also change the class and input fields update to the new initClass values. I might change it so that when you change class the stat levels update with the class for example Hero vigor 18, level 11 -> pick Warrior vigor 18, level 15. I'll save that for later. **IDEA:** Have a state that increases the levels but are added together with the `this.state.currentClass` but that would require the calc to take in two state values rather than one. 
- ~~`this.state.currentWeapon` doesn't update properly.~~ Same as before I didn't fire a function in setState to update it properly.
- ~~Let the search bar be in its own component.~~
- ~~The weapon is hard coded into the state if the api changes order then the scaling and req will be wrong.~~
- ~~When switching weapons that have more than one scaling and stat remain so a reset needs to be done after every press.~~
- ~~`onKeyDown` isn't recognize as a `ComponentDidUpdate`.~~
- ~~`ComponentDidUpdate` in `WeaponComponent.js` threw an undefined map error.~~ Solved I think, I honestly don't know. Whenever I would refreshed the webpage it threw the error, I tried all the states to see what happeneds and it was `this.state.currentWeapon.requiredAttributes` that threw the error. So I think it's 'cos `requiredAttributes` is async so it will be undefined.
- ~~Remove DRY in `ComponentDidUpdate` and `weaponConditions` functions. Don't know how to solve it since having Object.keys vs Array is... yeah was harder than expected. I'll need to revisit this after.~~ After some sleep I solved it by converting my obj to an array so that I could eliminate the DRY.
- ~~Crossbows break the site.~~
- ~~You need to choose another weapon before the calc is updated since the sheets are loaded to slowely. I could solve it by not displaying a weapon at the start but oh well...~~ I added a loaded state in the `DisplayComponent`, it takes some time to load but that is given 'cos of the large sheet files. 
- ~~Apparently there is a special scaling for the arc stat which I didn't know and can't find in the sheets...~~ I studied the code of [TimPoulton's elden ring ar calc](https://github.com/TomPoulton/elden-ring-damage-calculator/blob/main/js/calc/scaling.js) and noticed that the do not use the exponent growth for Arc scaling weapons.
---
##### TODO:
- DisplayComponent
    - CharComponent
        - [X] Elden Ring API working as intended
        - [X] Fill in the react state for classes and currently picked class
        - [X] Increment levels when buttons is pressed 
        - [X] Increment levels by writing in a textbox
        - [X] Up and down buttons to update the text-input field (Check known bugs)
        - [X] Add CSS to the component (~~React+bootstrap, normal className bootstrap or~~ custom CSS)
        - [X] Send levels back as prop to parent for WeaponComponent (req for weapon is meet) and StatsComponent (dmg calc)
        - [ ] ~~Add background image for each character class~~ I don't have the rights to use the artists work.
        - [ ] ~~Add softcap indications (add after all is done).~~
            - [ ] ~~Add yellow and red color for indications.~~
            - [ ] ~~Add a hover to yellow and red explaning why they are colored that way.~~
    - WeaponComponent
        - [X] Elden Ring API working as intended with images, text, and weapon stats
        - [x] Search for weapon in search bar break up into smaller parts: 
            - [X] First load the api with weapons. 
            - [X] Have the first weapon ready (maybe not needed)
            - [X] Filter from input. `includes()` is enough.
            - [X] Create a new div for each new suggestion under the input field.
            - [X] onClick update input field and `this.state.currentWeapon` with the new weapon.
        - [X] Take in currentClass as props.
        - [X] Display the `this.state.currentWeapon` on the page.
            - [X] Damage stats
            - [X] Image of the weapon
            - [X] Lore of the weapon img title tag if good enough.
            - [X] Scaling of the weapon
            - [X] Requirements of the weapon
        - [X] Add CSS (very basic css)
            - [X] Forgot the drop down window, save that for later.
        - [X] Indication if stats meet weapon requirements, red color for no. Compare `this.state.req` with `this.props.currentClass` stats.
            - [X] Change `this.state.weaponInfo.reqMet` for every lvl press and class change
            - [X] Change the color of text when requirements are not met.
        - [X] Add a cross in the search field so that it empties the input text field.
        - [ ] ~~Test cases, JEST or Reacts own libraries to ensure that dmg calcs are working as intended (Try to atleast)~~
        - [X] Backend for weapon dmg calulations (break this up into smaller categories and study the spreadsheet).
            - [X] Calc the added lvl scaling from character
            - [X] Load in the excel spread sheets.
            - [X] Find the `this.state.currentWeapon.name` in the excel spread sheet.
            - [X] Fetch all the excel sheets and att them to a corresponding object.
            - [X] Extract the groupingId and place them in the `currentWeapon`
            - [X] Extract the groupings with the help of ID and place them in the `currentWeapon`
            - [X] Extract the scalingValues and place them in the `currentWeapon`
            - [X] Add a penalty for when you don't meet the requirements. If one of the groups have one `reqMet=false` then make it the penalty `-baseDmg*0.4`
        - [ ] ~~Add a two handed button option~~ If I set up the CSS better then I would've added it
            - [ ] ~~This will add 50% to the strength stat when calculating the dmg.~~
    - [X] Move safe fetch to a utils file so that i dont perform DRY.

##### Dreams:
- [ ] Class change updates each stat and level rather than just wipe it clean.
- [ ] Three.js Smooth scrolling + a book that opens up.
- [ ] Create a Fimga design and implement it, or better design layout in general.
---

### Things to improve on in the future:
- ~~In the CharacterComponent I do two things, one is selecting a class and the other is manipulating the levels. I should've split these two into two seperate components but in doing so it could lead to prop drilling but the code is would be more readable. For this project it's fine but a thing to keep in mind in the future. One component should do one thing only and do that thing really well.~~ I just throw in the whole state to the child component, maybe not the best but [Done and dusted, out of this world!](https://www.tiktok.com/@foodiechina888/video/7104087329823870210?is_from_webapp=v1&item_id=7104087329823870210)
- I tried my best programming this with OOP in mind but the best thing would to be write future projects in [TypeScript](https://www.typescriptlang.org/). 
- Maybe try and design on [Figma](https://www.figma.com/) before my next project, a loooot of time was spent designing after coding basic functionality. Good to get programming functionality done before the css but a display in mind would go a long way. 
- There are limitations with the API. The API can't tell the difference between special weapons and normal weapons. Should've done more research or added that by hand, but going through 100 weapons... yeah no. Also when state managing the `this.state.currentWeapon`'s `requriedAttributes`/`scalesWith`, the API only provides the values that have a value. I had to do a work around to get what I wanted displayed on the screen. The code is still readable but I have a faaat state in `WeaponComponent.js`
- I learned to utilise what JS gives me and that is objects, I started of by having one state for weapons requirements and another for scaling, then I wanted to add reqMet so a third with the same code, DRY fixed but something to realise early next time... hopefully...
- At the end I gave up on all of the SOLID principles but one thing I really needed to learn before was that... I really need to plan how I'm going to use the data in the future. I had one API with their set of values then I used a totaly different API that presents data in a completetly different way. A real headache but something I will take with me in the future.
---
### Assets and Resources
[Elden Ring API](https://docs.eldenring.fanapis.com/docs/)

[Tutorial on how to calculate the weapon dmg](https://docs.google.com/document/d/1WbKxdSTRYTg3NLoOPbsCQzWnU3dxx1i5oR3NldgnQ0o/edit)

[How to mutate states correctly in react](https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react)

[How to use flex](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

[Update state properly](https://stackoverflow.com/questions/41446560/react-setstate-not-updating-state)

[How to created a "auto suggest" search bar. Wasn't much of use but it thought me a need a new render for each suggested weapon](https://www.youtube.com/watch?v=Ny5rkEKhaxc)

[When working with curly braces in react](https://stackoverflow.com/questions/53013437/expected-assignment-or-function-call-no-unused-expressions-reactjs)

[Work around for the object not being iniated while loading](https://stackoverflow.com/questions/2673147/javascript-array-value-is-undefined-how-do-i-test-for-that)

[Expected to return a value in arrow function array-callback-return warning](https://eslint.org/docs/latest/rules/array-callback-return)

[Google Sheets as a database](https://www.youtube.com/watch?v=K6Vcfm7TA5U)

---
