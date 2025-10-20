<?php

/**
 * Roundcube Design Plugin
 *
 * @author Daniel Yount
 * @author Daniel Yount <factor@userspace.org>
 * @license GNU GPLv3+
 *
 * Configuration (see config.inc.php.dist)
 */

class design extends rcube_plugin
{
    // all task excluding 'login' and 'logout'
    public $task = '?(?!login|logout).*';

    // we've got no ajax handlers  : Need ajax handler.
//    public $noajax = false;

    function init()
    {
        $this->load_config();
        $this->add_texts('localization/', false);

        // register task
        $this->register_task('design');

        // register actions
        $this->register_action('index', [$this, 'action']);
	$this->register_action('design', [$this, 'action']);
        $this->register_action('designsettings', [$this, 'action']);
        $this->register_action('about', [$this, 'action']);
	$this->register_action('license', [$this, 'action']);

	$this->register_action('senddraft', [$this, 'action']); 
	$this->register_action('tmplpress', [$this, 'action']); 
	$this->register_action('partpress', [$this, 'action']); 
	//$this->register_action('expartpress', [$this, 'action']); 


	$this->register_action('sessnotice', [$this, 'action']); 
	$this->register_action('editnotice', [$this, 'action']); 

	$this->register_action('cctemplate', [$this, 'action']); 

	$this->register_action('createpartbox', [$this, 'action']); 

	$this->register_action('checkdraft', [$this, 'action']); 
	$this->register_action('intemplates', [$this, 'action']); 

	//$this->register_action('inparts', [$this, 'action']); 
	//$this->register_action('inpartheader', [$this, 'action']); 
	$this->register_action('inpartcontent', [$this, 'action']); 
	//$this->register_action('inpartfooter', [$this, 'action']); 

	$this->add_hook('startup', [$this, 'start_script']);
        $this->add_hook('startup', [$this, 'startup']);
	$this->add_hook('error_page', [$this, 'error_page']);

	// register hook for message headers being processed
	$this->add_hook('message_headers_output', array($this, 'headers'));
    }

    function start_script($args)
    {
	$rcmail = rcmail::get_instance(); 
	// Add a simple JavaScript alert to the login page (for demonstration)
        //Dont run on refresh
	//Dont run if tmpl reset=0
	if(!isset($_COOKIE['design_tmpl_sync'])) {
        setcookie('design_tmpl_sync', 'true');
        $_COOKIE['design_tmpl_sync'] = 'true';
        }
	
	if(!isset($_COOKIE['design_part_sync'])) {
        setcookie('design_part_sync', 'true');
        $_COOKIE['design_part_sync'] = 'true';
        }
       
	$current_task = $rcmail->task;

        if( $current_task == "design" && $_COOKIE['design_tmpl_sync'] == 'true' ) {
		$this->tmplsync();
	}

        if( $current_task == "design" && $_COOKIE['design_part_sync'] == 'true' ) {
		$this->partsync();
	}


    return $args;
    }


    function startup($args)
    {
        $rcmail = rcmail::get_instance();
        if (!$rcmail->output->framed) {
            // add taskbar button
            $this->add_button([
                    'command'    => 'design',
                    'class'      => 'button-design',
                    'classsel'   => 'button-design button-selected',
                    'innerclass' => 'button-inner',
                    'label'      => 'design.design',
                    'type'       => 'link',
                ], 'taskbar'
            );

	    $this->include_script('design.js');
            $rcmail->output->set_env('design_open_extwin', $rcmail->config->get('design_open_extwin', false), true);
        }

        // add style for taskbar button (must be here) and Design UI
	$this->include_stylesheet($this->local_skin_path() . '/design.css');
    }



    //Session Notices will end up here.
    function sessnotice() {
	    $rcmail = rcmail::get_instance();
	    $session_click = rcube_utils::get_input_string('_button', rcube_utils::INPUT_POST); 
            switch($session_click) {
		case "sesssave":
                $response = "SESSION SAVED";
                break;
		case "sessload":
                $response = "SESSION LOADED";
                break;
                default:
                break;
             }
	    $rcmail->output->command('display_message', $response, 'confirmation');
    }


    //Editor Notices will end up here.
    function editnotice() {
    
	    $rcmail = rcmail::get_instance();

	    $right_click = rcube_utils::get_input_string('_button', rcube_utils::INPUT_POST); 


             switch($right_click) {
		case "moveenabled":
		// code block
                $response = "Part Move Enabled";
                break;
                case "movedisabled":
		// code block
                $response = "Part Move Disabled";
		break;
                case "dupdiv":
		// code block
                $response = "Part Duplicated";
		break;
                case "cutdiv":
		// code block
                $response = "Part Cut";
		break;
                default:
                break;
             }

	    $rcmail->output->command('display_message', $response, 'confirmation');
    }

    function cctemplate() {
            $store_folder = false;
            $store_target = null;

	    $rcmail = rcmail::get_instance();
	    $storage = $rcmail->get_storage();

	    $store_target = $rcmail->config->get('template_mbox');
             if ($storage->folder_exists($store_target, true)) {
                $store_folder = true;
	     }

            if (!$store_folder) {
	    $store_folder = $storage->create_folder('template', true);
	    $storage->subscribe($store_target);
	    $rcmail->output->command('display_message', 'CREATED MAILBOX', 'confirmation');
	    }
	    else {
	    $rcmail->output->command('display_message', 'MAILBOX EXIST', 'confirmation');
	    }

    }
   
    function checkdraft() {
            $store_folder = false;
            $store_target = null;

	    $rcmail = rcmail::get_instance();
	    $storage = $rcmail->get_storage();

	    $store_target = $rcmail->config->get('drafts_mbox');
             if ($storage->folder_exists($store_target, true)) {
                $store_folder = true;
	     }

            if ($store_folder) {
	    $rcmail->output->command('display_message', 'DRAFTS MAILBOX EXIST', 'confirmation');
	    }
	    else {
	    $rcmail->output->command('display_message', 'DRAFTS MAILBOX ISSUE', 'confirmation');
	    }

    } 

//Will read all rcdt files in plugin template directory and add them to the mailbox folder.  
function intmpls() {
	    $rcmail = rcmail::get_instance();
            $directory = $this->home . '/template';
            $rcdt_data = []; // An array to store the contents of each file
            $files = glob($directory . '/*.rcdt');
            $regexHTMLCOM = '/<!--(.*?)-->/s'; 

            // Check if glob() returned files
	    if ($files !== false) {
	    $num =0;	    
            foreach ($files as $filepath) {
                    $filename = basename($filepath, '.rcdt');
		    //$rcmail->output->command('display_message', 'FILE:'.$filename , 'confirmation');

                    if (is_readable($filepath)) {
			    //$rcdt_data[$filename] = file_get_contents($filepath);
			    $rcdt_data[$num] = file_get_contents($filepath);

			    //Need to read the HTML COMMENT for TITLE. 
			    if (preg_match($regexHTMLCOM, $rcdt_data[$num] , $matches)) {
			    $firstComment = $matches[1];
			    $title = explode(':', $firstComment);

		            $rcmail->output->command('display_message', 'FILE:'.$num." name:".$filename." TITLE:".$title[1]  , 'confirmation');
			    ///} 
	                    $storage = $rcmail->get_storage();
	                   if ($storage->folder_exists('template', true)) {
			     
		           $mboxdata = "From: \r\n"."To: \r\n"."Subject:".$title[1]." \r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$rcdt_data[$num]; 
			   $saved = $storage->save_message('template', $mboxdata,'', null,['FLAGGED']  );
		            } } }
		    $num++;
		    } }
                    }


function splitDivsById($html, $id) 
{
	
   $rcmail = rcmail::get_instance();
   $dom = new DOMDocument();
   libxml_use_internal_errors(true);
   $dom->loadHTML($html);
   libxml_clear_errors();

   $matchingDivs = [];
   $divs = $dom->getElementsByTagName('div');

   foreach ($divs as $div) {
    if ($div->hasAttribute('id') && $div->getAttribute('id') === 'rcd_container') {
        // Use $div->ownerDocument->saveHTML() to preserve the surrounding tags.
        // Or use $div->textContent to get only the text content.
        $matchingDivs[] = $dom->saveHTML($div);
       }
       }

   //foreach ($matchingDivs as $index => $divContent) {
   // $rcmail->output->command('display_message', 'FILE:'.$index." content:".$divCcontent , 'confirmation');
   //} 
 

  return $matchingDivs;
  }


 //Plans for future to have more containers to hold multiple parts. When used need to remove it/them though.  
 //For now just one item per mail until I get the bugs worked out.
function stripDivById(string $html, string $id): string
{
    // Create a new DOMDocument instance
    $dom = new DOMDocument();

    // Suppress warnings for malformed HTML
   libxml_use_internal_errors(true); 
    
    // Load the HTML string into the DOMDocument
    $dom->loadHTML($html);

    // Clear libxml errors
    libxml_clear_errors();

    // Get the element by its ID
    $divToRemove = $dom->getElementById($id);

    // If the element exists, remove it from its parent node
    if ($divToRemove) {
	    //$divToRemove->parentNode->removeChild($divToRemove);
	    $fragment = $dom->createDocumentFragment();

	    // Move all child nodes from the parent div to the fragment
            while ($divToRemove->hasChildNodes()) {
            $fragment->appendChild($divToRemove->firstChild);
            }
	    
	    // Replace the parent div with the fragment (which now contains only the children)
            $divToRemove->parentNode->replaceChild($fragment, $divToRemove);

            // Save the modified HTML back to a string
	    $parsedHtml = $dom->saveHTML();

            // Remove DOCTYPE and html/body tags that DOMDocument adds. 
            $parsedHtml = preg_replace('/<!DOCTYPE html[^>]*>/i', '', $parsedHtml);
            $parsedHtml = preg_replace('/<html[^>]*>(.*?)<\/html>/is', '$1', $parsedHtml);
            $parsedHtml = preg_replace('/<body[^>]*>(.*?)<\/body>/is', '$1', $parsedHtml);

    } else {
            $parsedHtml = "none"; 
    }

    return $parsedHtml;
}



 function inpart() {

	    $rcmail = rcmail::get_instance();
            $directory = $this->home . '/part';
	    $rcdp_data = []; // An array to store the contents of each file
	    $filename = [];
	    $part_data = []; //To handle pass to fixed array until I get group loading working.
	    $files = glob($directory . '/*.rcdp');

            // Check if glob() returned files
	    if ($files !== false) {
	    $num =0;	    
            foreach ($files as $filepath) {
                    $filename[1] = basename($filepath, '.rcdp');
		    $rcmail->output->command('display_message', 'FILE:'.$filename , 'confirmation');

                    if (is_readable($filepath )) {
			   //$rcdt_data[$filename] = file_get_contents($filepath);
			   $rcdp_data[$num] = file_get_contents($filepath);
			   //$rcmail->output->command('display_message', 'FILE:'.$num." name:".$filename , 'confirmation');


			   //Only one part per file currently. Hack to make this work for now.
                           $part_data[1] = $rcdp_data[$num]; 

	                   $storage = $rcmail->get_storage();
			   if ($storage->folder_exists('part', true)) {

            		   $this->installParts($part_data,$filename,1);  //This will be locked to 1 until I get group loads working.
                         
			                                              }
                                                }

	    }
	    $num++;
	    }}


    function installParts( $part = [], $partname = [], $maxval ) {
	            $replaceName = []; 
	            $rcmail = rcmail::get_instance();
	            $storage = $rcmail->get_storage();
	            if ($storage->folder_exists('part', true)) {
	            $rcmail->output->command('display_message', 'PART FOLDER EXIST', 'confirmation');
                     for ($num = 1; $num <= $maxval; $num++) {
                          // function to strip rcd_container here. If it does not exist skip. 
			  // Want to pull the versioin 1.2 TITLE fro mthe HTML COMMENT TO GET PART NAME
			  // If TITLE:: DOES NOT EXIST KEEP FILENAME
			     $replaceName[1] = $this->getFirstHTMLComment( $part[ $num ] );
			     if($replaceName) { $partname[$num] =  $replaceName[1]; }
			     //Find how many rcd_containers exist in partname[num] ,if more than one will be multipart load.
			     $numcontain = $this->containerCount( $part[$num] );
			     switch ($numcontain) {
			        case 0:
                                      $rcmail->output->command('display_message', 'PART '.$num.' MISSING CONTAINER.' , 'confirmation');
				      break; 
				case 1:
				      //Individual part load.
		                      $partHTML = $this->stripDivById( $part[$num], "rcd_container");
                                      $mboxdata = "From: \r\n"."To: \r\n"."Subject: ".$partname[$num]."\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$partHTML;
				      $saved = $storage->save_message("part", $mboxdata,'', null,["FLAGGED"]  );
                                      //$rcmail->output->command('display_message', 'PART PROCESSED'.$partHTML , 'confirmation');
				      break;	
				default:
				      //Multipart load
				      $partsToInstall = $this->splitDivsById( $part[$num] , "rcd_container");
				      //Individual load 		
				      foreach ($partsToInstall as $index => $divContent) {
					      //$rcmail->output->command('display_message', 'MULTIFILE:'.$index." content:".$divContent , 'confirmation');
					   //GET PART TITLE NAME
			                   $replaceName[1] = $this->getFirstHTMLComment( $divContent );
					   if($replaceName) { $partname[$num] =  $replaceName[1]; }

		                           $partHTML = $this->stripDivById( $divContent, "rcd_container");
                                           $mboxdata = "From: \r\n"."To: \r\n"."Subject: ".$partname[$num]."\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$partHTML;
				           $saved = $storage->save_message("part", $mboxdata,'', null,["FLAGGED"]  );
				                                                           } 
                                      //$rcmail->output->command('display_message', 'PART '.$num.' MULTIPART CONTAINER.' , 'confirmation');
			              break;	      
			                        }
		                                           }
		  $rcmail->output->command('display_message', 'INSTALLED PARTS '.$numcontain , 'confirmation');
	          }
	          else {
	          $rcmail->output->command('display_message', 'PART FOLDER MISSING', 'confirmation');
	          }
                  }


	    //Get rcd_container count and return value.
	    function containerCount( $partfile ) {
                  $pattern = '/<div[^>]*id=["\']rcd_container["\'][^>]*>/i';
		  $count = preg_match_all($pattern, $partfile, $matches);
	    return $count;
	    }

            //Still misses if it finds an open colin ,but missing close colon.
	    function getFirstHTMLComment( $partfile) {

	            $rcmail = rcmail::get_instance();
		    //$pattern = '/<!--(.*?)-->/sU'; 
		    $pattern = '/<!--(.*?)-->/s';
		    if (preg_match($pattern, $partfile, $matches)) {
                     // $matches[0] will contain the full matched comment (e.g., "<!-- This is a comment -->")
                     // $matches[1] will contain the content of the comment (e.g., " This is a comment ")
			    $firstComment = $matches[1];
			    $pattern2 = '/(?<=:)[^:]+(?=:)/'; 
			    if (preg_match($pattern2, $firstComment, $matched)) {
                                    $titleIs = $matched[0];
				    //$rcmail->output->command('display_message', 'First Comment: '.$titleIs , 'confirmation');
                                    return $titleIs;
			    }
		    } else {
			    //$rcmail->output->command('display_message', 'First Comment:NOT FOUND '.$partfile , 'confirmation');
			    return false;
                    }
	    }


    // Need to load all of the body items (up to 10) in local storage. Other subject lines in cookkies for now.
    function tmplsync(){
	    $rcmail = rcmail::get_instance();


	    //cookie for php session username.   
            $user = $rcmail->user;
	    $sess_user = $user->get_username();
	    setcookie("sess_user", $sess_user, time() + (86400 * 30), "/"); 

            //Cookie for total count of template items in template folder
	    $count = $this->count_tmpls(); 
	    setcookie("total_count", $count, time() + (86400 * 30), "/"); 

	  //Seprate cookie for template list . May make this into an array of subjects and only use one cookie. 
	  //Will be limited to 10 anyway. 
	    $flag_count = $this->get_tmpl_subject($sess_user, $count);
            $active_count = count( $flag_count );
	    setcookie("active_count", $active_count, time() + (86400 * 30), "/"); 

	  //Active Count should already be limited from the subject cutoff.  
	  $i=1;
	  while ($i <= $active_count ) {
		  $body = urlencode($this->get_tmpl_body($sess_user,$flag_count[$i-1]));
		  $this->setLocalStoreFromServer( $sess_user , "tmpl_body".$i , $body );
	  	  $i++;
          }
	  
 		$rcmail->output->command('display_message', 'TEMPLATES SYNCED', 'confirmation');
    
                //Set cookie to sync template data  
        	setcookie('design_tmpl_sync', 'false');
    }


    //Create Parts Folder. 
    function createpartbox() {
            $store_folder = false;
            $store_target = null;

	    $rcmail = rcmail::get_instance();
	    $storage = $rcmail->get_storage();

	    $store_target = $rcmail->config->get('part_mbox');
             if ($storage->folder_exists($store_target, true)) {
                $store_folder = true;
	     }

            if (!$store_folder) {
	    $store_folder = $storage->create_folder('part', true);
	    $storage->subscribe($store_target);
	    $rcmail->output->command('display_message', 'CREATED PARTBOX', 'confirmation');
	    }
	    else {
	    $rcmail->output->command('display_message', 'PARTBOX EXIST', 'confirmation');
	    }

    }

    // Need to load all of the body items (up to 10) in local storage. Other subject lines in cookies for now.
    function partsync(){
	    $rcmail = rcmail::get_instance();

	    //cookie for php session username.   
            $user = $rcmail->user;
	    $sess_user = $user->get_username();
	    setcookie("sess_user", $sess_user, time() + (86400 * 30), "/"); 

            //Cookie for total count of template items in template folder
	    $count = $this->count_parts(); 
	    setcookie("total_count_part", $count, time() + (86400 * 30), "/"); 


	  //Seprate cookie for template list . May make this into an array of subjects and only use one cookie. 
	  //Will be limited to 10 anyway. 

            //TODO NEED TO ADD PART TYPE.
	    $flag_count = $this->get_part_subject($sess_user, $count);
            $active_count_part = count( $flag_count );
	    setcookie("active_count_part", $active_count_part, time() + (86400 * 30), "/"); 

	  //Active Count should already be limited from the subject cutoff.  
	    $i=1;$Nheader=0;$Ncontent=0;$Nfooter=0;
	    //With multiple catalogs need more than 10 so using total count.
	    while ($i <= $active_count_part ) {

                  //need more than 10 for parts
		  $raw_body = $this->get_part_body($sess_user,$flag_count[$i-1]);
		  //$raw_body = $this->get_part_body($sess_user,$i-1);

                  //Needs to be rcd_header=header rcd_content=content rcd_footer=footer
		  $typeof =  $this->scan_part_type( $raw_body );
		  if($typeof == "header")  {$Nheader++; $Ni  = $Nheader;
		  setcookie("active_count_partheader", $Ni, time() + (86400 * 30), "/"); 
		  // Set name for part subject here will use js to fill in Local Storage value. 
		  $this->setLocalStoreFromServer( $sess_user , "part_subject".$i."_".$typeof.$Ni ,"");
		  }
		  if($typeof == "content") {$Ncontent++;$Ni  = $Ncontent;
		  setcookie("active_count_partcontent", $Ni, time() + (86400 * 30), "/"); 
		  // Set local storage name for part subject here using $i
		  $this->setLocalStoreFromServer( $sess_user , "part_subject".$i."_".$typeof.$Ni ,"" );
		  }
		  if($typeof == "footer")  {$Nfooter++; $Ni  = $Nfooter;
		  setcookie("active_count_partfooter", $Ni, time() + (86400 * 30), "/"); 
		  // Set local storage name for part subject here using $i
		  $this->setLocalStoreFromServer( $sess_user , "part_subject".$i."_".$typeof.$Ni ,"" );
		  }
		  $body = urlencode($raw_body);

		  $this->setLocalStoreFromServer( $sess_user , "part_body".$typeof.$Ni , $body );
	  	  $i++;
          }
	  
 		$rcmail->output->command('display_message', 'PARTS SYNCED', 'confirmation');
    
                //Set cookie to sync template data  
        	setcookie('design_part_sync', 'false');
    }



 function scan_part_type( $part ) { 
   $dom = new DOMDocument(); 
   @$dom->loadHTML($part);
   $elheader = $dom->getElementById('rcd_header');
   if($elheader) { return "header"; }
   $elcontent = $dom->getElementById('rcd_div');
   if($elcontent) { return "content"; }
   $elfooter = $dom->getElementById('rcd_footer');
   if($elfooter) { return "footer"; }
   return "none";
   }


    //Will make duplicates readf and write functions for parts for now. 
    //Need to combined them once I get the logic worked out. 
    function count_parts() {
    //This will get the count of message in the template folder.
    $total=0;
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $total = $storage->count('part', 'ALL');
    return $total;
    }

    //TODO NEED TO ADD PART TYPE.
    //function get_part_subject($num , $count ) {
    function get_part_subject($sess_user, $count ) {
	    //This will get the subject line from specific message in part folder.
	    $num=1;
	    $numf=0;
	    $numbers = array();
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $storage->set_folder('part'); 
    $storage->set_options(['all_headers' => true ]);
    $index = $storage->index('part');
    $uids = $index->get(); 
    $messages = $storage->fetch_headers( 'part', $uids);

    foreach ($messages as $message) {
            //Limit to 10 flagged subjects *** NO LONGER LIMIT TO 10    
	    if (!empty($message->flags['FLAGGED']) ) {
	            $numf++;  //increment the flagged count.
		    $subject = $message->get('subject');

                    //Limit character of subject to 20
                    $maxLength = 20;
		   if (mb_strlen($subject) > $maxLength) {
			   $subject = mb_substr($string, 0, $maxLength); 
		   }
		    $this->setLocalStoreFromServer( $sess_user , "part_subject".$type.$numf , $subject );
		    array_push($numbers, $num );
	    }
            $num++;  //Increament overall count.
            }
            return $numbers; //Return count of only flagged messages.
    }


    //This finds one message from body uid and returns it.
    function get_part_body($sess_user , $count ) {
    //This will get the subject line from specific message in template folder.
    $num=1;
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $storage->set_folder('part'); 
    $storage->set_options(['all_headers' => true ]);
    $index = $storage->index('part');
    $uids = $index->get(); 
    $messages = $storage->fetch_headers( 'part', $uids);
    foreach ($uids as $uid) {
	    if($num == $count ){
		    $body = $storage->get_body($uid);
                               break;
	   		      } 
                             $num++;
                              } 
                         return $body;
    }



    //I would like ot add other functions to only count Subject lines
    //that start with tmpl: and a way to enalbe this and disable this pretext.
    function count_tmpls() {
    //This will get the count of message in the template folder.
    $total=0;
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $total = $storage->count('template', 'ALL');
    return $total;	    
    }

     
    //function get_tmpl_subject($num , $count ) {
    function get_tmpl_subject($sess_user, $count) {
	    //This will get the subject line from specific message in template folder.
	    $num=1;
	    $numf=0;
	    $numbers = array();
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $storage->set_folder('template'); 
    $storage->set_options(['all_headers' => true ]);
    $index = $storage->index('template');
    $uids = $index->get(); 
    $messages = $storage->fetch_headers( 'template', $uids);

    foreach ($messages as $message) {
            //Limit to 10 flagged subjects     
	    if (!empty($message->flags['FLAGGED']) && $num <= 10 ) {
	            $numf++;  //increment the flagged count.
		    $subject = $message->get('subject');

                    //Limit character of subject to 20
                    $maxLength = 20;
		   if (mb_strlen($subject) > $maxLength) {
			   $subject = mb_substr($string, 0, $maxLength); 
		   }
		    $this->setLocalStoreFromServer( $sess_user , "tmpl_subject".$numf , $subject );
		    array_push($numbers, $num );
 		    //$rcmail->output->command('display_message', 'SUBJECT: FLAGGED:'.json_encode($numbers), 'confirmation');
	    }
            $num++;  //Increament overall count.
            }
            return $numbers; //Return count of only flagged messages.
    }


    //This find one message from body uid and returns it.
    function get_tmpl_body($sess_user , $count ) {
    //This will get the subject line from specific message in template folder.
    $num=1;
    $rcmail = rcmail::get_instance();
    $storage = $rcmail->get_storage();
    $storage->set_folder('template'); 
    $storage->set_options(['all_headers' => true ]);
    $index = $storage->index('template');
    $uids = $index->get(); 
    $messages = $storage->fetch_headers( 'template', $uids);
    foreach ($uids as $uid) {
	    if($num == $count ){
		    $body = $storage->get_body($uid);
                               break;
	   		      } 
                             $num++;
                              } 
                         return $body;
    }


    //Creates javascript to be loaded from footer into  client side.
    //Any function that uses this , needs to be generated from redner_page or init/start.
    function setLocalStoreFromServer( $user , $key , $value )  {
	    $rcmail = rcmail::get_instance();
            $userdata = "design_".$user."_".$key;
            $script = <<<EOL
            localStorage.setItem('$userdata', '$value');
            EOL;    
            $rcmail->output->add_script($script, 'docready'); 
    }

    function savetodraft()
    {
          $draftname = rcube_utils::get_input_string('_dn', rcube_utils::INPUT_POST);
	  $draftdata = rcube_utils::get_input_string('_message', rcube_utils::INPUT_POST);
	  $rcmail = rcmail::get_instance();
	  //Send draftdata to draft mbox.
          $store_target = $rcmail->config->get('drafts_mbox');
	  $storage = $rcmail->get_storage();
	  $mboxdata = "From: \r\n"."To: \r\n"."Subject: ".urldecode($draftname)."\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".urldecode($draftdata); 
	  $saved = $storage->save_message($store_target, $mboxdata,'', null, ['NOTSEEN'] );
	  $rcmail->output->command('display_message', 'SAVED DRAFT', 'confirmation');
    }

    public function tmplpress()
    {
          $tmplname = rcube_utils::get_input_string('_tn', rcube_utils::INPUT_POST);
          $tmpldata = rcube_utils::get_input_string('_tp', rcube_utils::INPUT_POST);

	  $rcmail = rcmail::get_instance();
	  //Send editor page to template mbox.
	  $storage = $rcmail->get_storage();
    
	 $mboxdata = "From: \r\n"."To: \r\n"."Subject: ".urldecode($tmplname)."\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".urldecode($tmpldata); 
	  $saved = $storage->save_message('template', $mboxdata,'', null, ['FLAGGED'] );
	  $rcmail->output->command('display_message', 'Template Made', 'confirmation');
    }

    public function partpress()
    {
          $partname = rcube_utils::get_input_string('_pn', rcube_utils::INPUT_POST);
          $partdata = rcube_utils::get_input_string('_pp', rcube_utils::INPUT_POST);

	  $rcmail = rcmail::get_instance();
	  //Send editor part to part mbox.
	  $storage = $rcmail->get_storage();
         //TODO FOR SOME REASON PART DATA IS NOT DECODED. 
	 $mboxdata = "From: \r\n"."To: \r\n"."Subject: ".urldecode($partname)."\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".urldecode($partdata); 
	  $saved = $storage->save_message('part', $mboxdata,'', null, ['FLAGGED'] );
	  $rcmail->output->command('display_message', 'Part Made', 'confirmation');
    }


    function action()
    {
        $rcmail = rcmail::get_instance();

        if ($rcmail->action == 'about') {
		$rcmail->output->set_pagetitle($this->gettext('about'));
        }
        else if ($rcmail->action == 'designsettings') {
		$rcmail->output->set_pagetitle($this->gettext('designsettings'));
	}
        else if ($rcmail->action == 'senddraft') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->savetodraft();
	}
        else if ($rcmail->action == 'tmplpress') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->tmplpress();
	}
        else if ($rcmail->action == 'partpress') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->partpress();
	}
        else if ($rcmail->action == 'expartpress') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->expartpress();
	}

        else if ($rcmail->action == 'sessnotice') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->sessnotice();
	}
        else if ($rcmail->action == 'editnotice') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->editnotice();
	}
        else if ($rcmail->action == 'cctemplate') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->cctemplate();
	}
        else if ($rcmail->action == 'checkdraft') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		$this->checkdraft();
	}
        else if ($rcmail->action == 'intemplates') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		//$this->intemplates();
		$this->intmpls();
	}  
	else if ($rcmail->action == 'createpartbox') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
                $this->createpartbox();
	} 
//        else if ($rcmail->action == 'inpartheader') {
//		$rcmail->output->set_pagetitle($this->gettext('design'));
//		//$this->inparts("header");
//		$this->inpart();
//	}
        else if ($rcmail->action == 'inpartcontent') {
		$rcmail->output->set_pagetitle($this->gettext('design'));
		//$this->inparts("content");
		$this->inpart();

	}
        //else if ($rcmail->action == 'inpartfooter') {
//		$rcmail->output->set_pagetitle($this->gettext('design'));
//		//$this->inparts("footer");
//		$this->inpart();
//	}


        else {
		$rcmail->output->set_pagetitle($this->gettext('design'));
        }

        // register UI objects
        $rcmail->output->add_handlers([
                'designcontent'  => [$this, 'design_content'],
        ]);

        $rcmail->output->set_env('design_links', $this->design_metadata());
        $rcmail->output->send(!empty($_GET['_content']) ? 'design.content' : 'design.design');
    }

    function design_content($attrib)
    {
        $rcmail = rcmail::get_instance();

	if (!empty($_GET['_content'])) {
            if ($rcmail->action == 'design') {
                return file_get_contents($this->home . '/content/design.html');
	    }
	    else if ($rcmail->action == 'senddraft') {
                return file_get_contents($this->home . '/content/design.html');
	    }
	    else if ($rcmail->action == 'designsettings') {
                return file_get_contents($this->home . '/content/designsettings.html');
            }
	    else if ($rcmail->action == 'about') {
                return file_get_contents($this->home . '/content/about.html');
            }
        }
    }

    function design_metadata()
    {
        $rcmail  = rcmail::get_instance();
        $content = [];
	
	// Design
        if (is_readable($this->home . '/content/design.html')) {
            $content['design'] = 'self';
        } else {
            $content['design'] = $rcmail->config->get('design_design_url', $default);
            $content['design'] = $this->resolve_language($content['design']);
	}

        // About
        if (is_readable($this->home . '/content/about.html')) {
            $content['about'] = 'self';
        } else {
            $content['about'] = $rcmail->config->get('design_about_url', $default);
            $content['about'] = $this->resolve_language($content['about']);
	}

        // Designsettings
        if (is_readable($this->home . '/content/designsettings.html')) {
            $content['designsettings'] = 'self';
        } else {
            $content['designsettings'] = $rcmail->config->get('design_designsettings_url', $default);
            $content['designsettings'] = $this->resolve_language($content['designsettings']);
	}

        // Senddraft
        if (is_readable($this->home . '/content/design.html')) {
            $content['senddraft'] = 'self';
        } else {
            $content['senddraft'] = $rcmail->config->get('design_senddraft_url', $default);
            $content['senddraft'] = $this->resolve_language($content['senddraft']);
	}

        return $content;
    }

    function error_page($args)
    {
        $rcmail = rcmail::get_instance();

        if (
            $args['code'] == 403
            && $rcmail->request_status == rcube::REQUEST_ERROR_URL
            && ($url = $rcmail->config->get('design_csrf_info'))
        ) {
            $args['text'] .= '<p>' . html::a(['href' => $url, 'target' => '_blank'], $this->gettext('csrfinfo')) . '</p>';
        }

        return $args;
    }

    private function resolve_language($path)
    {
        // resolve language placeholder
        $rcmail  = rcmail::get_instance();
        $langmap = $rcmail->config->get('design_language_map', ['*' => 'en_US']);
        $lang    = !empty($langmap[$_SESSION['language']]) ? $langmap[$_SESSION['language']] : $langmap['*'];

        return str_replace('%l', $lang, $path);
    }
}
