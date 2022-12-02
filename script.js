$(document).ready(function(){

    console.log(moment().hours())
    //makes text saved to local storage persist
    $('#nineText').val(localStorage.getItem('nineText'))
    
    //save text to local storage
    $('#nineBtn').on('click', function () {
      localStorage.setItem('nineText', $('#nineText').val())
    })
  });