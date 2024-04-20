// My JavaScript code.

/*GENERAL FUNCTIONS*/
/**This is ran everytime a key is pressed and will remove any error from the display*/
var sensitive = false; //This will be true when we want the display to clear before entering another digit
function keyPress() { //Will be used to clear the display when a unique answer or error is on display
    let disp = document.getElementById("display");
    if (dispCheck() || sensitive == true) {
        disp.value = '';
        sensitive = false;
    }
}
function dispCheck() { //This will check the display for any error text. 
    let disp = document.getElementById("display");
    if (disp.value == "Error" || disp.value == "undefined" || disp.value == "NaN" || disp.value == "Infinity") {
        return true;
    }
    else {
        return false;
    }
}
function displayError() //Used to display errors
{
    let disp = document.getElementById("display");
    disp.value = "Error";
}
/*KEYPRESSES*/
//this section is for the keypad presses, for when the user presses a key it appears in display

addEventListener("keydown", (ev) => { //this'll run everytime a key is pressed.
    var disp = document.getElementById("display");//declare this here so it can be used throughout
    
    //I researched a unique way to identify the key pressed, and utilized it in this code
    if (//I formatting this a bit weirdly so its not 1 long line. Each line represents a different OR clause
        (ev.code == `Key${ev.key.toUpperCase()}`)
        || (ev.code == `Digit${ev.key}`)
        || (ev.code == `Minus`)
        /*|| (ev.code == `BracketLeft`)
        || (ev.code == `BracketRight`)
        || (ev.code == `Period${ev.key}`)
        || (ev.code == `Period${ev.key}`)*/
    ) {
        keyPress();
        disp.value += ev.key;//will put the the key into the display.
    }
    else if (//This section is for the scenarios in which it which the user presses shift to access the key: '(',')','+',
        (ev.code == `Equal` && ev.shiftKey) //this is for '='
        || (ev.code == `Digit9` && ev.shiftKey) //for '('
        || (ev.code == `Digit0` && ev.shiftKey) //For ')'
        || (ev.code == `Digit8` && ev.shiftKey) //For '*'
    ) { //unique scenario in which it which the user presses the + above the =
        keyPress();
        disp.value += ev.key;//will put the the key into the display.
    }
    else if (ev.code == `Equal` || ev.code == `Enter`) {//this will run calculate(), as if pressing the '=' button
        keyPress();
        disp.value = calculate(disp.value);
    }
    else if (ev.code == `Delete` || ev.code == `Backspace`) {//For the 'delete' key and backspace, to delete the far-right digit
        keyPress();
        disp.value = disp.value.substring(0, (display.value.length) - 1)
    }
    else if (ev.code == `Slash`) { //division symbol 
        keyPress();
        disp.value += '/';
    }
})


/**VERIFICATIONS*/
function verify(val) {
    var a = bracketCheck(val);
    /*This will run all verification functions to check the display.
    I seperated the verification into multiple functions so it's easier to see where errors occur and edit*/
    if (bracketCheck(val) //This verifies brackets aren't breaking the program.
        || symbolCheck(val)  //this verifies the symbols are correctly done.
        || digitCheck(val)) { 
        displayError();
    }
}
function bracketCheck(disp2) { //This function will check that brackets (if any) are done correctly.
    //Multiple checkers needed due to the variety of situations it can go wron
    var checker = 0;
    var checker2 = false;
    var checker3 = true;
    //This loop checks there's the correct number of ( and ) by adding/subtracting to checker.
    for (let i = 0; i < disp2.length; i++) {
        if (disp2[i] == "(") {
            checker += 1;
            checker2 = true; //This means that a bracket has been opened, 
        }
        else if (disp2[i] == ")") {
            checker -= 1;
            if (checker2 == true) { //This is to specify that an openned bracket has been closed.
                checker2 = false;
            }
            else if (checker < 0) { //This is to stop ) from appearing before any ( 
                checker3 = false;
            }
        }
    }

    //The below is to combine the various verifications for the final result
    if (checker != 0 || checker2 == true || checker3 == false) {
        return true; //true if equation is broken
    }
    else {
        return false; 
    }

}
function symbolCheck(disp2) {//This will check that there's no symbols directly next to eachother. For example: a--c, b++2, a/+3, etc.
    //The one exception to this is when the 2 end in -, as that represents negatives. For example: 10+-5= 5, 10/-2= -5, etc
    for (let i = 0; i < disp2.length; i++) {
        //First, see if it's one of the main symbols
        if ((disp2[i] == "+") || (disp2[i] == "-") || (disp2[i] == "/") || (disp2[i] == "x") || (disp2[i] == "*")) {
            if ((i + 1) == disp2.length) {
                //In this scenario, the symbol is at the very end of the expression.. which it shouldnt be
                return true;
            }
            else if (i == 0) {
                //in this scenario, the very first character is a symbol. Only acceptable if it's a + or -
                if (!((disp2[i + 1] == "+") || (disp2[i + 1] == "-"))) {
                    //It's now, and instead a /,x or *. so its an error such as: /23, *2+3, etc
                    return true;
                }
            }
            if ((disp2[i + 1] == "+") || (disp2[i + 1] == "-") || (disp2[i + 1] == "/") || (disp2[i + 1] == "x") || (disp2[i + 1] == "*")) {
                //By this point, there are 2 symbols together. Unacceptable, as such: we verify the 2nd isnt a - before displaying an error
                if (disp2[i + 1] == "-") {
                    //2nd symbol was a -, so it's a doable expression.
                    return false;
                }
                else {
                    //here, the expression is not doable, it's something similar to -+, --, ++, */.. so on.
                    return true;
                }
            }
        }
    }

}
function digitCheck(disp2) {//This will verify all the equation has no alphabetical characters (except x)
    var checker = false;
    for (let i = 0; i < disp2.length; i++) {
        //This verification utilizes regular expressions to see if the digit is in the alphabet.
        if (/^[a-zA-Z]+$/.test(disp2[i])) {
            //Now we verify that the value isn't x, and continue:
            if (!(disp2[i] == 'x')) {
                //we only want lowercase x, not uppercase.
                checker = true;
            }
        }
    }
    return checker;

}


/*CALCULATIONS*/
/**This will be used when = is pressed, or in certain other functions */
function calculate(disp)
{
    var result;
    result = disp.replace("x", "*").replace("π", ("(" + Math.PI + ")")).replace("e", ("(" + Math.E + ")"));
;    /** eval() can only do + and -, so we have to do the rest */

    //will verify the equation, simplifying it to a form eval() can solve
    verify(result);
    result = eval(result);
    if (result == "0") { /*This is a minor change, so if the result is 0 than the display will clear the 0 off before more is typed. 
                         (otherwise it leads to the display showing 03, 01, etc)*/
        sensitive = true;
    }
    return result;
}

/*MODES*/ 
function basicMode()//This will change the operations to arithmetic mode
{
    document.getElementById("Operation1").innerHTML = "exp()";
    document.getElementById("Operation2").innerHTML = "x!";
    document.getElementById("Operation3").innerHTML = "log()";
    document.getElementById("Operation4").innerHTML = "ln()";
    document.getElementById("Operation5").innerHTML = "√x";
    document.getElementById("Operation6").innerHTML = "3√x";
}
function trigMode() //This will change the operations to trig mode
{
    document.getElementById("Operation1").innerHTML = "sin()";
    document.getElementById("Operation2").innerHTML = "cos()";
    document.getElementById("Operation3").innerHTML = "tan()";
    document.getElementById("Operation4").innerHTML = "cosec()";
    document.getElementById("Operation5").innerHTML = "sec()";
    document.getElementById("Operation6").innerHTML = "cot()";
}
function conversionMode() { //This will change the operations to arithmetic mode. can only convert to-from positiev denary
    document.getElementById("Operation1").innerHTML = "Den → Bin";
    document.getElementById("Operation2").innerHTML = "Den → Hex";
    document.getElementById("Operation3").innerHTML = "Den → Oct";
    document.getElementById("Operation4").innerHTML = "Bin → Den";
    document.getElementById("Operation5").innerHTML = "Hex → Den";
    document.getElementById("Operation6").innerHTML = "Oct → Den";
}

/*MODE-BUTTONS*/
/**The below is the javascript for the operations.*/
function job1() { //For the top operation button.
    //collect the data on display & which operation is in use.
    let val = document.getElementById("Operation1").innerHTML;
    let disp = document.getElementById("display");
    let num = calculate(disp.value);

    if (val == "exp()") { //This will perform the e^x equaton
        if (dispCheck()) { //This'll check if the display has an error. (it will if calculate() went wrong)
            displayError();
        }
        else {
            disp.value = (Math.E) ** num;
        }

    }
    else if (val == "sin()") {
        //For trig mode.Note: function similar to the exp() one
        if (dispCheck()) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else {
            let product = disp.value = Math.cos(num * Math.PI / 180); //Had to turn the input into radians for math.cos()
            //This 'if' statement is to correct rounding errors at sin(90), which shoul be 0 but instead showed 0.000000122.. 
            if (Math.abs(product) < Number.EPSILON) {
                disp.value = "0";
            }
            else {
                //this is for when there isnt a rounding error, just displays the sin value
                disp.value = product;
            }
        }
    }
    else if (val == "Den → Bin") {
        var final = ""; //"final" is a placeholder for the binary
        if ((dispCheck()) || num < 0) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else { 
            //verifies there isnt a decimal in the denary
            for (let i = 0; i < num.toString().length; i++) {
                if (num.toString()[i] == '.') {
                    displayError();
                    return;
                }
            }
            //this loop uses the division method of converting. it'll keep dividng the num by 2, until it cant be done again
            for (num; num >= 1;) {
                if (num % 2 == 1) {
                    final += "1";
                    num = (num / 2) - 0.5;
                     }
                else {
                    final += '0';
                    num = num / 2;
                }   
            }

            //Then we reverse the invert the string to get the binary

            var holder = "0"; //holder is a placeholder for the inverted binary. starts with 0 so the MSB is 0
            for (let i = 0; i < final.length; i++) { //itereates through the binary backwards, adding them to holder.
                holder += final[(final.length - i - 1)];
            }
            disp.value = holder; 
            sensitive = true; //set this to true so the display clears after any button is pressed  
        }
    }
    else { displayError(); }//Safety preduction: loads error if something messed up the operation labels

}
function job2() {
    //collect the data on display & which operation is in use.
    let val = document.getElementById("Operation2").innerHTML;
    let disp = document.getElementById("display");
    let num = calculate(disp.value);

    if (val == "x!") { //Basic Arithmetic mode (finds the factorial)
        if (dispCheck()) {
            displayError();
        }
        else {
            var holder = 1;
            for (let i = 1; i < (num + 1); i++) {
                holder = holder * i;//Technically factorial is meant to work backwards (50*49*...), but doing it the other way has the same result
            }
            disp.value = holder;
        }

    }
    else if (val == "cos()") { //trig mode operation
        //For this I reused a lot of the code from the sin() function
        //For trig mode.Note: function similar to the exp() one
        if (dispCheck()) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else {
            let product = disp.value = Math.cos(num * Math.PI / 180); //calculates cos(num) by turning the num to radians
            if (Math.abs(product) < Number.EPSILON) {//fixes some rouding errors
                disp.value = "0";
            }
            else {
                disp.value = product;
            }
        }
    }
    else if (val == "Den → Hex") {
        //I did research and found this simplified method of turning a denary number to hexadecimal. 
        if (dispCheck()) {
            displayError();
        }
        else {
            //Chekcs there isnt a decimal in the denary
            for (let i = 0; i < num.toString().length; i++) {
                if (num.toString()[i] == '.') {
                    displayError();
                    return;
                }
            }
            
            disp.value = num.toString(16);
            sensitive = true;//this is to clear the display afterwards
        }
    }
    else { displayError(); }//Safety preduction: loads error if something messed up the operation labels
}
function job3() {
    //Same variables used for job2() and job1(), but now for job3().
    let val = document.getElementById("Operation3").innerHTML;
    let disp = document.getElementById("display");
    let num = calculate(disp.value);

    if (val == "log()") { //log() operation
        if (dispCheck() || num <= 0) {//check displays has no errors and number is greater than 0 (log only accepts positive numbers)
            displayError();
        }
        else {
            //log() is essentially ln(), so to make it log10(), we divide log(x) by log(10). 
            disp.value = Math.log(num) / Math.log(10);
        }

    }
    else if (val == "tan()") {
        if (dispCheck()) {//check display has no errors
            displayError();
        }
        else {
            if (num % 90 == 0) { //tan() goes to infinity at tan(90), tan(270) etc... this is to check if the value may be impossible
                if (num % 180 != 0) { //if num%180=0, the value is a multiple of 180 and possible. infact, it'd result in 0
                    displayError();
                }
                else {//All other values are multiples of tan(180), which all result in 0.
                    disp.value = 0;
                }
            }
            else {
                //Same code as previous section, except using tan() now
                let product = disp.value = Math.tan(num * Math.PI / 180); //turns num to radians to calculate tan()
                if (Math.abs(product) < Number.EPSILON) {//fixes rouding errors
                    disp.value = "0";
                }
                else {
                    disp.value = product;
                }
            }
        }
    }
    else if (val == "Den → Oct") {
        if (dispCheck()) {//check display has no errors
            displayError();
        }
        else {
            for (let i = 0; i < num.toString().length; i++) { //will make sure the denary has no decimals
                if (num.toString()[i] == '.') {
                    displayError();
                    return;
                }
            }
            disp.value = num.toString(8);
            sensitive = true;//this is to clear the display afterwards

        }
    }
    else { displayError(); }//incase operation is misspelt

}
function job4() {
    //collect the data on display & which operation is in use.
    let val = document.getElementById("Operation4").innerHTML;
    let disp = document.getElementById("display");
    let num = calculate(disp.value);

    if (val == "ln()") {
        if (dispCheck() || num <= 0) {//check displays has no errors and number is greater than 0 (ln() only accepts positive numbers)
            displayError();
        }
        else {
            disp.value = Math.log(num);
        }
    }
    else if (val == "cosec()") {
        //For this I reused a lot of the code from the sin() function
        if (dispCheck()) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else {
            //since cosec(x) is 1/sin(x), sin(x) cannot equal 0 otherwise it's impossible.
            if (num % 180 == 0) {//sin(x) = 0 when x is a multiple of 180.
                displayError();
                return;
            }
            else {
                let product = Math.sin(num * Math.PI / 180); //calculates sin(num) by turning the num to radians
                disp.value = (1 / product); //product = sin(num), so 1/sin(num) will be the cosec(num)
            }
        }
    }
    else if (val == "Bin → Den") {
        if (dispCheck()) {//First checks the display has no errors
            displayError();
        }
        else {//Unlike previous modes, we have to restrict the input to 0s and 1s.
            var hold = (2 ** ((disp.value).toString().length - 1)); //The below loop will work from the MSG to LSB. This holder variable will serve as the denary of each spot
            var final = 0;
            for (let i = 0; i < (disp.value).toString().length; i++) { //will make sure the denary has no decimals
                if (disp.value[i] == '.'
                    || disp.value[i] == '+' || disp.value[i] == '/' || disp.value[i] == '-' || disp.value[i] == '*') {//ensure it has no symbols.
                    displayError();
                    return;
                }
                else if (disp.value[i] != "1") { //This section is to verify the input is in binary format (just 1s and 0s)
                    if (disp.value[i] != "0") {
                        displayError();
                        return;
                    }
                }
                //By this point, we've ensured the curent digit is a binary 0 or 1
                if (disp.value[i] == "1") { //checks if the digit is 1
                    final += hold; //will add the value of that position's 1 to the final
                }
                else {
                }
                hold = hold / 2; //we divide hold by 2, to move its value to the next digit 

            }
            //By now, 'final' holds the denary
            disp.value = final;
            //denary after so no clear needed.

        }
    }
    else { displayError(); } //incase there's some issue with the buttons
}
function job5() {
    //variables as seen in previous section
    let val = document.getElementById("Operation5").innerHTML;
    let disp = document.getElementById("display");
    //Unlike other jobs, we calculate the disp.value in the individual sections as to not interfere with the hex -> den.
    let num;
    if (val == "√x") {
        num = calculate(disp.value);
        if (dispCheck() || num < 0) {//check displays has no errors and is greater than 0 (doesnt support imaginery numbers)
            displayError();
        }
        else {
            disp.value = Math.sqrt(num);
        }
    }
    else if (val == "sec()") {
        num = calculate(disp.value);
        //For this I reused code from the cosec() and cos() function
        if (dispCheck()) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else {
            //since sec(x) is 1/cos(x), cos(x) cannot equal 0 otherwise it's impossible.
            if (num % 90 == 0) {//cos(x) = 0 when x is 90,270,450, etc.
                if (num % 180 != 0) { //verifies the angle isnt a multiple of 180 (which would be a doable number)
                    displayError();
                    return;
                }
                else {
                    if (num % 360 == 0) { //in this scenario will only be cases where cos(x) = 0,360,720... (so cos(x)=1) 
                        disp.value = 1;
                    }
                    else {//to get here, num%90==9,num%180==0,num%360!=0, so its a multiple of 180, but not of 360
                        disp.value = -1; //in this case, cos(180*n)= -1, so the final would be -1
                    }
                }
            }
            else { //now the value isnt a nice one at 0,90,180,... so we calculate it as normal
                let product = Math.cos(num * Math.PI / 180); //calculates cos(num) by turning the num to radians
                disp.value = (1 / product); //product = cos(num), so 1/cos(num) will be the cosec(num)
            }
        }
    }
    else if (val == "Hex → Den") {
        //This section doesn't utilize (num = calculate(disp.value);), as its not needed.
        if (dispCheck()) {//First checks the display has no errors
            displayError();
        }
        else {//Unlike previous modes, we have to restrict the input to 0s and 1s.
            var hold = (16 ** ((disp.value).toString().length - 1)); //The below loop will work from the MSG to LSB. This holder variable will serve as the denary of each spot
            var final = 0;
            for (let i = 0; i < (disp.value).toString().length; i++) {
                if (disp.value[i] == '.'//will make sure the denary has no decimals
                    || disp.value[i] == '+' || disp.value[i] == '/' || disp.value[i] == '-' || disp.value[i] == '*') {//ensure it has no symbols. 
                    displayError();
                    return;
                }
                else if (!(disp.value[i] < 10 )){
                    if (disp.value[i].toLowerCase() <= 'f') {
                        if (disp.value[i].toLowerCase() == 'a') {
                            final += 10;
                        }
                        else if (disp.value[i].toLowerCase() == 'b') {
                            final += 11;
                        }
                        else if (disp.value[i].toLowerCase() == 'c') {
                            final += 12;
                        }
                        else if (disp.value[i].toLowerCase() == 'd') {
                            final += 13;
                        }
                        else if (disp.value[i].toLowerCase() == 'e') {
                            final += 14;
                        }
                        else if (disp.value[i].toLowerCase() == 'f') {
                            final += 15;
                        }
                        else { displayError(); }//its an alphabet but not allowed in hex
                    }
                }
                //By this point, we've ensured the curent char is a digit from 0 to 9
                final = parseInt(disp.value, 16).toString(10); 

            }
            //By now, 'final' holds the denary
            disp.value = final;
            //denary so no need to clear

        }
    }
    else { displayError(); } //incase there's some issue with the buttons
}
function job6() {
    //same as usual
    let val = document.getElementById("Operation6").innerHTML;
    let disp = document.getElementById("display");
    let num = calculate(disp.value);

    if (val == "3√x") {
        if (dispCheck() || num < 0) {//check displays has no errors and number is greater than 0 (doesnt work with imaginery numbers)
            displayError();
        }
        else {
            disp.value = Math.cbrt(num);
        }
    }
    else if (val == "cot()") {
        //For this I reused code from the cosec() and cos() function
        if (dispCheck()) {
            //this runs if there was an issue in the number.
            displayError();
        }
        else {
            //since tan(x) is 1/tan(x). tan(x) expands to infinity at 90 and 270 degrees, and is 0 at 0, 180, 360 degrees
            if (num % 90 == 0) {//this will make sure the value is 0,90,180,270,360,etc..
                if (num % 180 != 0) { //for the scenario in which tax(x) expands to infinity
                    //1/infintiy can be interpreted as 0, so we display 0
                    disp.value = "0"; //for this
                    return;
                }
                else {//this occurs when the angle is 0,180,360,etc
                    displayError(); //for this, it results in 1/0, which is impossible
                    return;
                }
            }
            else { //now the value isnt a nice one at 0,90,180,... so we calculate it as normal
                let product = Math.tan(num * Math.PI / 180) ; //calculates cos(num) by turning the num to radians
                disp.value = (1 / product); //product = cos(num), so 1/cos(num) will be the cosec(num)
            }
        }
    }
    else if (val == "Oct → Den") {
        if (dispCheck()) {//First checks the display has no errors
            displayError();
        }
        else {//Unlike previous modes, we have to restrict the input to 0s and 1s.
            var hold = (8 ** ((disp.value).toString().length - 1)); //The below loop will work from the MSG to LSB. This holder variable will serve as the denary of each spot
            var final = 0;
            for (let i = 0; i < (disp.value).toString().length; i++) {
                if (disp.value[i] == '.' || (disp.value[i] > 7)//will make sure the octal has no decimals and is base-8.
                    || disp.value[i] == '+' || disp.value[i] == '/' || disp.value[i] == '-' || disp.value[i] == '*') {//ensure it has no symbols
                    displayError();
                    return;
                }
                //By this point, we've ensured the curent char is a digit from 0 to 9
                final += (hold * disp.value[i]); //will add the value of that position's 1 to the final
                hold = hold / 8; //we divide hold by 2, to move its value to the next digit 

            }
            //By now, 'final' holds the denary
            disp.value = final;
            //won't clear the display after since it's a denary
        }
    }
    else { displayError(); } //incase there's some issue with the buttons
}
