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
        //$this->register_action('savedraft', [$this, 'action']);
        $this->register_action('designsettings', [$this, 'action']);
        $this->register_action('about', [$this, 'action']);
	$this->register_action('license', [$this, 'action']);

	$this->register_action('senddraft', [$this, 'action']); 

	$this->register_action('cctemplate', [$this, 'action']); 
	$this->register_action('checkdraft', [$this, 'action']); 
	$this->register_action('intemplates', [$this, 'action']); 

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
	
        $current_task = $rcmail->task;
        if( $current_task == "design" && $_COOKIE['design_tmpl_sync'] == 'true' ) {
		$this->tmplsync();
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


    function cctemplate() {
            $store_folder = false;
            $store_target = null;

	    $rcmail = rcmail::get_instance();
	    $storage = $rcmail->get_storage();

	    $store_target = $rcmail->config->get('template_mbox');
             if ($storage->folder_exists($store_target, true)) {
                $store_folder = true;
	     }

            if ($store_folder) {
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


    //Install predefined templates. You can add you own and flag them to be added , but will only recognize 10 at a time. 
    function intemplates() {
	  $template1 = file_get_contents( $this->home . '/template/basic_invoice.html');
	  $template2 = file_get_contents( $this->home . '/template/basic_newsletter.html');
	  $template3 = file_get_contents( $this->home . '/template/basic_template.html');

	  $rcmail = rcmail::get_instance();
	  $storage = $rcmail->get_storage();
	  if ($storage->folder_exists('template', true)) {
		  $rcmail->output->command('display_message', 'TEMPLATE FOLDER EXIST', 'confirmation');

		  $mboxdata1 = "From: \r\n"."To: \r\n"."Subject: Invoice\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$template1; 
		  // Save mesage as FLAGGED , the drop down will only read in 10 and has to be flagged. Subject is limited to 20 chars.
		  $saved = $storage->save_message('template', $mboxdata1,'', null,['FLAGGED']  );

		  $mboxdata2 = "From: \r\n"."To: \r\n"."Subject: NewsLetter\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$template2; 
		  $saved = $storage->save_message('template', $mboxdata2,'', null,['FLAGGED']  );

		  $mboxdata3 = "From: \r\n"."To: \r\n"."Subject: Basic Template \r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".$template3; 
		  $saved = $storage->save_message('template', $mboxdata3,'', null,['FLAGGED']  );

	  $rcmail->output->command('display_message', 'INSTALLED TEMPLATES', 'confirmation');
	  }
	  else {
	  $rcmail->output->command('display_message', 'TEMPLATE FOLDER MISSING', 'confirmation');
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


    //This find one message bosy from uid and returns it.
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
                    //$rcmail->output->command('display_message', 'BODY: '.strval($body) , 'confirmation');
    		    //$this->setLocalStoreFromServer( $sess_user , "tmpl_body".$num , $body );
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
            console.log( "localstorage set" );
            EOL;    
            $rcmail->output->add_script($script, 'docready'); 
    }
    
    

    function savetodraft()
    {
	  $draftdata = rcube_utils::get_input_string('_message', rcube_utils::INPUT_POST);
	  $rcmail = rcmail::get_instance();
	  //Send draftdata to draft mbox.
          $store_target = $rcmail->config->get('drafts_mbox');
	  $storage = $rcmail->get_storage();
	  $mboxdata = "From: \r\n"."To: \r\n"."Subject: RoundCube Design Save\r\n"."Content-Type: text/html; charset=utf-8`:\r\n"."\r\n".urldecode($draftdata); 
	  $saved = $storage->save_message($store_target, $mboxdata,'', null, ['NOTSEEN'] );
	  $rcmail->output->command('display_message', 'SAVED DRAFT', 'confirmation');
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
		$this->intemplates();
	}
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
