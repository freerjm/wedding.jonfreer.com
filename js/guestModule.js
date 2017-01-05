var guestModule = (function(){

    //signifies the guest that the
    //user is working with.
    var currentGuest = {};

    return {

        //sets the current guest.
        setCurrentGuest: function(var guest){

            if( typeof !== "object" ||
                guest.id === undefined ||
                guest.givenName === undefined ||
                guest.surname === undefined ||
                guest.inviteCode === undefined ||
                guest.dietaryRestrictions === undefined ||
                guest.description === undefined
            ){
                throw "The guest object provided is invalid.";
            }

            currentGuest = guest;
        },

        //retrieves the current guest.
        getCurrentGuest: function(){
            return currentGuest;
        }

        //retrieves guests that have the invite code provided.
        getGuests: function(var inviteCode, var success, var error){

        },

        //retrieves a single guest by id.
        getGuest: function(var id, var success, var error){

        },

        //replaces the current state of a guest with the
        //guest state provided.
        updateGuest: function(var guest, var success, var error){

            if( typeof !== "object" ||
                guest.id === undefined ||
                guest.givenName === undefined ||
                guest.surname === undefined ||
                guest.inviteCode === undefined ||
                guest.dietaryRestrictions === undefined ||
                guest.description === undefined
            ){
                throw "The guest object provided is invalid.";
            }

            if(success !== undefined && typeof success === "function"){
                throw "The value of the 'success' parameter must be a function.";
            }

            if(error !== undefined && typeof error === "function"){
                throw "The value of the 'error' parameter must be a function.";
            }

            ajaxModule.put(
                "http://freer.ddns.net:8080/api/wedding/guests/" +
                    window.document.getElementById("guest-id").value + "/",
                [
                    { header: "Content-Type", value: "application/json" },
                    { header: "Accept", value: "application/json" },
                ],
                guest,
                success,
                error
            );
        }
    };
})(ajaxModule);