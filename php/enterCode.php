<?php

	/*
		Represents an invited guest that may
		or may not come to the wedding.
	*/
	class Guest{
		public $guest_id 			= -1;
		public $first_name 			= "";
		public $last_name  			= "";
		public $guest_description	= "";
		public $has_plus_one = false;
		public $has_reservation		= false;
	}

	/*
		Represents the response that is to be
		sent back to the client.
	*/
	class Response{
		public $code 						= 0;
		public $codeDescription	= "";
		public $message					= "";
		public $data						= [];
	}

	//grab the code that the user entered.
	$codeEntered = $_POST["rsvp-code"];

	//$serverName 	= "localhost";
	$serverName 	= "jonfreer.com";
	$username			= "jonfreer";
	$password			= "__Goalie31__";
	$databaseName	= "jonfreer_wedding";

	$connection = new mysqli($serverName, $username, $password, $databaseName);

	if($connection->connect_error){

		//create error response object.
		$error_response = new Response();
		$error_response->code 						= 1;
		$error_response->codeDescription 	= "DATABASE CONNECTION ERROR";
		$error_response->message 					= "there was an issue connecting to the database.";

		echo(json_encode($error_response, JSON_PRETTY_PRINT));
	}

	$sql	= "	SELECT
					GUEST_ID,
					FIRST_NAME,
					LAST_NAME,
					GUEST_DESCRIPTION,
					HAS_PLUS_ONE,
					IS_ATTENDING
				FROM
					jonfreer_wedding.GUEST AS G
					LEFT OUTER JOIN jonfreer_wedding.RESERVATION AS R
					ON G.RESERVATION_ID = R.RESERVATION_ID
				WHERE
					G.INVITE_CODE = '" . $codeEntered . "'";

	$result = $connection->query($sql);

	$currentGuest = null;
	$guestsWithMatchingInviteCode = array();

	if($result->num_rows > 0){
		while($row = $result->fetch_assoc()){
			$currentGuest = new Guest();
			$currentGuest->guest_id = $row["GUEST_ID"];
			$currentGuest->first_name = $row["FIRST_NAME"];
			$currentGuest->last_name = $row["LAST_NAME"];
			$currentGuest->guest_description = $row["GUEST_DESCRIPTION"];
			if($row["HAS_PLUS_ONE"] == 1){
				$currentGuest->has_plus_one = true;
			}
			if($row["IS_ATTENDING"] == 1){
				$currentGuest->has_reservation = true;
			}
			$guestsWithMatchingInviteCode[] = $currentGuest;
		}
	}

	//create the success response object.
	$success_response = new Response();
	$success_response->code 							= 0;
	$success_response->codeDescription 		= "SUCCESS";
	$success_response->message 						= "there were " . $result->num_rows .
																					" guests found with code " . $codeEntered . ".";
	$success_response->data 							=	$guestsWithMatchingInviteCode;

	//close the database connection. maybe can do this earlier? need the $result object.
	$connection->close();

	//send it off.
	echo(json_encode($success_response, JSON_PRETTY_PRINT));

?>