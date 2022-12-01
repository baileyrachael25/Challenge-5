//scheduler js goes in here
//set variables
var today = moment().format("[Today is ] dddd, MMMM Do YYYY, h:mm");
var textAreaEl = document.getElementsByClassName("text-area");
var now = moment().format("HH");
var saveEl = document.getElementsByClassName("saveBtn");
var calendarItems = [];
var timeEl = document.getElementsByClassName('hour');
var stripped = [];

//passes today's date and time to DOM
window.setInterval(function () {
    $('#currentDay').html(moment().format("[Today is ] dddd, MMMM Do YYYY, h:mm"))
}, 1000);

//reloads page every hour (couldn't get timeSlide() to work with this without a page reload)
function tick() {
    //get the mins of the current time
    var mins = new Date().getMinutes();
    if (mins == "00") {
        //calls page reload instead of timeSlide()
        location.reload();
    }
}
//calls tick() every 30 seconds
setInterval(tick,30000); 

//creates reference array for time based on calendar row time headers
function helper() {
    for (n = 0; n < timeEl.length; n++){
        stripped.push(timeEl[n].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim());
    }
    return stripped;
}

//styles time rows based on time of day (past/present/future)
function timeSlide() {
    for (i = 0; i < timeEl.length; i++){
        var convertTime = moment(timeEl[i].textContent, 'ha').format('HH');
        if (convertTime < now) {
            $(timeEl[i]).next().addClass("past");
        } else if (convertTime > now) {
            $(timeEl[i]).next().addClass("future");
        } else {
            $(timeEl[i]).next().addClass("present");
        }
    }
}

//saves text input to localStorage and sets to DOM
function saveText(event) {
    var calendarObj = {date:"", item:[]};
    var itemObj = {time:"" , text:""};
    var todayDate = moment().format('DD-MM-YYYY');
    var timeDay = $(this).prev().prev()[0].textContent;
    try {
        var newText = $(this).prev().children()[1].value;
    
        itemObj.time = timeDay;
        itemObj.text = newText;

        var localCheck = JSON.parse(localStorage.getItem("calendar-items"));
        
        if (localCheck.length > 0) {
            calendarItems = JSON.parse(localStorage.getItem("calendar-items"));
            for (i = 0; i < localCheck.length; i++){
                //checks if calendarItems already has an object for that date
                if (calendarItems[i].date === todayDate){
                    for (x = 0; x < calendarItems[i].item.length; x++){
                        if (calendarItems[i].item[x].time === itemObj.time) {
                            calendarItems[i].item[x].text = itemObj.text;
                        } 
                    }
                }
            }
        }
        localStorage.setItem("calendar-items", JSON.stringify(calendarItems));

        //restores element to DOM with new text
        $(this).prev().children()[1].remove();
        $(this).prev().children()[0].remove();
        $(this).prev()[0].textContent = newText;
    } catch(err) {
        window.alert("No input detected");
    }
}

//listener for text input elements of calendar
$(document).on('click', '.text-area', function() {
    var classList = $(this).attr("class");
    var $textInput = $('<textarea class="form-control ' + classList + '"></textarea>');
    var $form = $('<div class="form-group ' + classList + '"></div>');
        ;
    $(this).before($form);
    $(this).remove().appendTo($form).hide();
    
    // Add some styles:
    $textInput.css({
        display: 'block',
        width: '100%',
        height: '100%',
        font:  $(this).css('font'),
        color: 'black',
    });
    $textInput.css("background-color", "transparent");
    $textInput.css("border", "none");
    $textInput.css("max-width", "100%");

    // Build up the form:
    $form.append($textInput);
    $textInput.val($(this).text()).focus();
});

//initializes data on page load/reload
function init() {
    var calendarObj = {date:"", item:[]};
    var localCheck = JSON.parse(localStorage.getItem("calendar-items"));
    var todayDate = moment().format('DD-MM-YYYY');
    var dCounter = 0;
    //if no calendar object, create one for today
    if (localCheck === null){
        for (z = 0; z < stripped.length; z++){
            var itemObj = {time:"" , text:""};
            itemObj.time = stripped[z];
            calendarObj.item.push(itemObj);
            calendarObj.date = todayDate;
        }
        calendarItems.push(calendarObj)
        localStorage.setItem("calendar-items", JSON.stringify(calendarItems));
    } else { //calendar object found
        //sets today's local object to calendarItems in preparation for appending them to DOM
        for (i = 0; i < localCheck.length; i++){
            if (localCheck[i].date === todayDate){
                calendarItems = localCheck[i];
                dCounter++;
            }
        }
        if (dCounter === 1){ //One day object found
        //finds and appends stored data for relevant date and time
            for (i = 0; i < calendarItems.item.length; i++){
                for (n = 0; n < stripped.length; n++){
                    if (calendarItems.item[i].time === stripped[n]){
                        $(timeEl[n]).next().append(calendarItems.item[i].text + " ");
                    }
                }
            }
        } else if (dCounter === 0) { //no day object found, updates local with new empty day object
            for (z = 0; z < stripped.length; z++){
                var itemObj = {time:"" , text:""};
                itemObj.time = stripped[z];
                calendarObj.item.push(itemObj);
                calendarObj.date = todayDate;
            }
            calendarItems = localCheck;
            calendarItems.push(calendarObj)
            localStorage.setItem("calendar-items", JSON.stringify(calendarItems));
        }
    }
}

//Activate save buttons, run time styling, initialize page data
$(saveEl).on('click', saveText);
timeSlide();
helper();
init();