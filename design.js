/**
 * Design plugin client script
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 *
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 */




// hook into switch-task event to open the design window
if (window.rcmail) {
        //Set client values for template button.
        var activecount = 0;
	var tmplsubj = new Array(10).fill(""); 

document.addEventListener("DOMContentLoaded", function() { 	

     const btn_design = document.querySelector('.btn-design'); 
     const btn_savedraft = document.querySelector('.btn-savedraft'); 
     const btn_designsettings = document.querySelector('.btn-designsettings'); 
     const btn_tsize = document.querySelector('.btn-tsize' );
     const btn_about = document.querySelector('.btn-about');

  if (btn_design) {
     btn_design.addEventListener('click', () => { 
  const url = new URL(window.location.href);
  const params = url.searchParams; 
  params.set('_action', 'design'); 
  window.location.href = url.toString();
});
                   }

  if (btn_savedraft) {
     btn_savedraft.addEventListener('click', () => { 
     draftit();	     
            });
                  }

  if (btn_tsize) {
     btn_tsize.addEventListener('click', () => { 
     toggleDivSize();	     
            });
                  }

//Disable Toggle Size and Save Draft
  if (btn_designsettings) {
     btn_designsettings.addEventListener('click', () => { 
  const url = new URL(window.location.href);
  const params = url.searchParams; 
  params.set('_action', 'designsettings'); 
  window.location.href = url.toString();
});
                     }

//Disable Toggle Size and Save Draft
  if (btn_about) {
     btn_about.addEventListener('click', () => {  
  const url = new URL(window.location.href);
  const params = url.searchParams; 
  params.set('_action', 'about'); 
  window.location.href = url.toString();
});
                          }

});

//Start	after menu stuff here.

    function toggleDivSize() {
    var tDiv = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");	
    tDiv.forEach ( function (comment){
    comment.classList.toggle('small-size');
    }); 
    }

    
    function draftit() {
	     var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
	     txtNote.forEach ( function (comment){
		const encodedString = encodeURI(comment.outerHTML);     
 	        rcmail.http_post('senddraft', { _message: encodedString} , false );
	     }); 
                       }

//Settings page functions.
     function createCheckTemplateMbox() {
             //console.log('Create Check Template Folder clicked!');
	     const Bpress = "cctemplate";
 	     rcmail.http_post('cctemplate', { _button: Bpress} , false );

     }  

    function CheckDraftMbox() {
	    const Bpress = "checkdraft";
 	     rcmail.http_post('checkdraft', { _button: Bpress} , false );
     }  

     function InsertTemplatesMbox() {
	     //Will check templates folder before doing so.
	     const Bpress = "intemplates";
 	     rcmail.http_post('intemplates', { _button: Bpress} , false );

     }  


       //All this does is set the cookie to true from the SYNC button on settings and then reloads and run synctmpl function
       function updateTmpl() {
	       setCookie('design_tmpl_sync','true',2); 
              const url = new URL(window.location.href);
              const params = url.searchParams;
              params.set('_action', 'designsettings');
              window.location.href = url.toString();

       }


     //All of the needed data is in localstorage.	 
     function importTemplate( num ) {
             console.log( "IMPORT NUM: "+num );
             sess_user = getCookie("sess_user") || "";
             const tmplBody =  decodeURIComponent( localStorage.getItem('design_'+sess_user+'_tmpl_body'+num)).replace(/\+/g, " "); 
	     //Get editor area
             var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block")
	     //Place tmplBody in edit area.
	     txtNote.forEach ( function (comment){
		comment.innerHTML = tmplBody;     
	     });
     }


    rcmail.addEventListener('beforeswitch-task', function(prop) {
        // Catch clicks to design task button
        if (prop == 'design') {
            if (rcmail.task == 'design')  // we're already there
                return false;

	    //Start in Design mode active. Have it set to About for test. 	 
            var url = rcmail.url('design/about' );
            if (rcmail.env.design_open_extwin) {
                rcmail.open_window(url, 1020, false);
            }
            else {
                rcmail.redirect(url, false);
            }

            return false;
        }
    });

    rcmail.addEventListener('init', function(prop) {

        //Set client values for template button.
        activecount = getCookie("active_count") || 0;
        sess_user = getCookie("sess_user") || "";
        i=1;
	while (i <= activecount) {
        tmplsubj[i]  = localStorage.getItem('design_'+sess_user+'_tmpl_subject'+i ) || "";
        i++;
	}

        if (rcmail.env.contentframe && rcmail.task == 'design') {
            $('#' + rcmail.env.contentframe).on('load error', function(e) {
                // Unlock UI
                rcmail.set_busy(false, null, rcmail.env.frame_lock);
                rcmail.env.frame_lock = null;

                // Select menu item
                if (e.type == 'load') {
                    $(rcmail.env.design_action_item).parents('ul').children().removeClass('selected');
                    $(rcmail.env.design_action_item).parent().addClass('selected');
                }
            });

            try {
                var win = rcmail.get_frame_window(rcmail.env.contentframe);
                if (win && win.location.href.indexOf(rcmail.env.blankpage) >= 0) {
                    show_design_content(rcmail.env.action);
                }
            }
            catch (e) { /* ignore */ }
        }
    });
}

function show_design_content(action, event)
{
    var win, target = window,
        url = rcmail.env.design_links[action];

    if (win = rcmail.get_frame_window(rcmail.env.contentframe)) {
        target = win;
        url += (url.indexOf('?') > -1 ? '&' : '?') + '_framed=1';
    }

    if (rcmail.env.extwin) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + '_extwin=1';
    }

    if (/^self/.test(url)) {
        url = url.substr(4) + '&_content=1&_task=design&_action=' + action;
    }

    rcmail.env.design_action_item = event ? event.target : $('[rel="' + action + '"]');
    rcmail.show_contentframe(true);
    rcmail.location_href(url, target, true);

    return false;
}


function setCookie(cname,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = cname + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

