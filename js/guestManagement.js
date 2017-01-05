function Guest(firstName, lastName, inviteCode, description, dietaryRestrictions, reservation){
  this.givenName = firstName;
  this.surName = lastName;
  this.inviteCode = inviteCode;
  this.description = description;
  this.dietaryRestrictions = dietaryRestrictions;
  this.reservation = reservation;
}

function Reservation(isAttending){
  this.isAttending = isAttending;
}

/*
  Once focus is lost on the 'last name' field,
  check to see if the 'first-name' field is filled out
  and then perform an AJAX request.
*/

function overwriteFields(guests){

  if(guests !== undefined && guests !== null){

    if(guests.length > 0){
        var guest = guests[0];

        var firstNameInput = window.document.getElementsByName("guest-first-name")[0];
        var lastNameInput = window.document.getElementsByName("guest-last-name")[0];
        var inviteCodeInput = window.document.getElementsByName("guest-invite-code")[0];
        var description = window.document.getElementsByName("guest-description")[0];
        var dietaryRestrictions = window.document.getElementsByName("guest-dietary-restrictions")[0];
        var reservationStatus = window.document.getElementsByName("guest-reservation-status")[0];
        var reservationStatusOptions = reservationStatus.options;

        firstNameInput.value = guest.givenName;
        lastNameInput.value = guest.surName;
        inviteCodeInput.value = guest.inviteCode;
        description.value = guest.description;
        dietaryRestrictions.value = guest.dietaryRestrictions;

        if(guest.reservation !== undefined && guest.reservation !== null){
          if(guest.reservation.isAttending){
            reservationStatus.options[2].selected = true;
          }else{
            reservationStatus.options[1].selected = true;
          }
        }else{
          reservationStatus.options[0].selected = true;
        }
    }else{
        window.alert("no guests were found.");
    }
  }
}

function readFields(){
  var firstNameInput = window.document.getElementsByName("guest-first-name")[0];
  var lastNameInput = window.document.getElementsByName("guest-last-name")[0];
  var inviteCodeInput = window.document.getElementsByName("guest-invite-code")[0];
  var description = window.document.getElementsByName("guest-description")[0];
  var dietaryRestrictions = window.document.getElementsByName("guest-dietary-restrictions")[0];
  var reservationStatus = window.document.getElementsByName("guest-reservation-status")[0];

  var reservation = null;

  if(reservationStatus.selectedIndex === 1){
    reservation = new Reservation(false);
  }else if(reservationStatus.selectedIndex === 2){
    reservation = new Reservation(true);
  }

  var guest = new Guest(
    firstNameInput.value,
    lastNameInput.value,
    inviteCodeInput.value,
    description.value,
    dietaryRestrictions.value,
    reservation
  );

  return guest;
}

function success(response){
  window.alert("success!");
}

function error(response){
  window.alert(response.message);
}

function setupEventHandlers(){

  //grab the 'first-name' field.
  var firstNameInput = window.document.getElementsByName("guest-first-name")[0];

  //grab the 'last-name' field.
  var lastNameInput = window.document.getElementsByName("guest-last-name")[0];

  //set up event handlers.
  lastNameInput.addEventListener("blur", function blurEvent(e){
    if(firstNameInput.value !== "" && lastNameInput.value !== ""){
      ajaxModule.get(
        "http://freer.ddns.net:8080/api/wedding/guests/?givenName=" +
            firstNameInput.value + "&surname=" + lastNameInput.value,
        [
            { header: "Content-Type", value: "application/json" },
            { header: "Accept", value: "application/json" },
        ],
        overwriteFields,
        null
      );
    }
  });

  var saveButton = window.document.getElementById("guest-info-save-button");

  saveButton.addEventListener("click", function(e){
    e.preventDefault();
    var guest = readFields();
    ajaxModule.post(
      "http://freer.ddns.net:8080/api/wedding/guests/",
      [
        { header: "Content-Type", value: "application/json" },
        { header: "Accept", value: "application/json" },
      ],
      guest,
      success,
      error
    );
  });
}

var globalUtility = new Utility();

window.onload = function(){
	setupEventHandlers();

  var guestDescription = window.document.getElementsByName("guest-description")[0];
  guestDescription.value = 'Guest';
}
