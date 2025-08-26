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
        var activecountpart = 0;
	var tmplsubj = new Array(10).fill(""); 
	var partsubj = new Array(10).fill(""); 

document.addEventListener("DOMContentLoaded", function() { 	


     const btn_design = document.querySelector('.btn-design'); 
     const btn_savedraft = document.querySelector('.btn-savedraft'); 
     const btn_designsettings = document.querySelector('.btn-designsettings'); 
     const btn_tsize = document.querySelector('.btn-tsize' );
     const btn_tzoom = document.querySelector('.btn-tzoom' );

     const btn_savesess = document.querySelector('.btn-savesess' );
     const btn_loadsess = document.querySelector('.btn-loadsess' );
     
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

  if (btn_tzoom) {
     btn_tzoom.addEventListener('click', () => { 
     toggleDivZoom();	     
            });
                  }

  if (btn_savesess) {
     btn_savesess.addEventListener('click', () => { 
     saveSession();	     
            });
                  }
  if (btn_loadsess) {
     btn_loadsess.addEventListener('click', () => { 
     restoreSession();	     
            });
                  }

  if (btn_designsettings) {
     btn_designsettings.addEventListener('click', () => { 
  const url = new URL(window.location.href);
  const params = url.searchParams; 
  params.set('_action', 'designsettings'); 
  window.location.href = url.toString();
});
                     }

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

    function toggleDivZoom() {
    var tDiv = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");	
    tDiv.forEach ( function (comment){
    comment.classList.toggle('zoom-out');
 
    var scaleY = comment.getBoundingClientRect().height / comment.offsetHeight;  
    var scaleX = comment.getBoundingClientRect().width / comment.offsetWidth;  
    var htmlContent = comment.innerHTML;

    console.log( "ScaleY:" + scaleY );	    
    console.log( "ScaleX:" + scaleX );	    

    if ( scaleX === 0.5) {
    var dub = comment.offsetHeight * 1.9;
    comment.style.height = String(dub) +"px";    
    console.log("shrink");	    
    } 
    if (scaleX  === 1 ) {

    //Use local storage to save current edit window HTML and reset from screwy CSS.
    const encodedString = encodeURI(htmlContent);
    localStorage.setItem('rcd_EditWindow', encodedString);
    localStorage.setItem('rcd_reload', "zoom");

    console.log("No Zoom");	    
    document.querySelector("iframe").contentWindow.location.reload(true);
	   
    }  });  }


    
    function draftit() {
	     var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
	     txtNote.forEach ( function (comment){
		const encodedString = encodeURI(comment.outerHTML);     
 	        rcmail.http_post('senddraft', { _message: encodedString} , false );
	     }); 
                       }



     function noticeSessSave() {
	     const Bpress = "sesssave";
	     console.log("Save Session");
 	     rcmail.http_post('sessnotice', { _button: Bpress} , false );
     }

     function noticeSessLoad() {
	     const Bpress = "sessload";
	     console.log("Load Session");
 	     rcmail.http_post('sessnotice', { _button: Bpress} , false );
     }

//Editor Function Notices. Will need editnotice function. 

     function noticeMoveEnabled() {
	     const Bpress = "moveenabled";
 	     rcmail.http_post('editnotice', { _button: Bpress} , false );
     }


     function noticeMoveDisabled() {
	     const Bpress = "movedisabled";
 	     rcmail.http_post('editnotice', { _button: Bpress} , false );
     }

     function noticeDupDIV() {
	     const Bpress = "dupdiv";
 	     rcmail.http_post('editnotice', { _button: Bpress} , false );
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
     function createCheckPartMbox() {
	     const Bpress = "createpartbox";
 	     rcmail.http_post('createpartbox', { _button: Bpress} , false );

     }  
     function InsertPartMbox() {
	     //Will check templates folder before doing so.
	     const Bpress = "inparts";
 	     rcmail.http_post('inparts', { _button: Bpress} , false );

     }  



       //All this does is set the cookie to true from the SYNC button on settings and then reloads and run synctmpl function
       function updateTmpl() {
	       setCookie('design_tmpl_sync','true',2); 
              const url = new URL(window.location.href);
              const params = url.searchParams;
              params.set('_action', 'designsettings');
              window.location.href = url.toString();

       }

       //All this does is set the cookie to true from the SYNC button on settings and then reloads and run syncpart function
       function updatePart() {
	       setCookie('design_part_sync','true',2); 
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
	     document.querySelector("iframe").contentWindow.highlightDIV(); //check and enable highlighting.
     }

	//IMPORT SPECIFIC IMPORT PARTS FROM MENU
        function importPart( num ) {
             console.log( "IMPORT NUM: "+num );
             sess_user = getCookie("sess_user") || "";
             const partBody =  decodeURIComponent( localStorage.getItem('design_'+sess_user+'_part_body'+num)).replace(/\+/g, " "); 
	
	     
		
	     //Get editor area
             var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
	     txtNote.forEach ( function (doctmpl){
               
             //Scan first line of template for DYNAMIC otherwise no part can be inserted.
              const HTMLlines = doctmpl.firstChild;
	      const rex = new RegExp(" DYNAMIC ");      
              if (rex.test( HTMLlines.textContent )) {

	     //Scan for first DIV tag's ID.      
	     const regex = /<div[^>]*id="([^"]*)"[^>]*>/i;  
             const PartMatch = partBody.match(regex);
		
	     if (PartMatch && PartMatch[1]) {     
                  console.log( PartMatch[1] );
		  
		  switch (PartMatch[1]) {
  			case "rcd_header":	
                                        // Function to Replace Header DIV tag
                			var tmplChildHeader  =  doctmpl.querySelector("#rcd_header");
                                        console.log( tmplChildHeader );
                                        tmplChildHeader.outerHTML = partBody;  
                                        break;
  			case "rcd_div":	
                                        // Function to Insert Content as child of rcd_content
                			var tmplChildContent =  doctmpl.querySelector("#rcd_content");
                                        console.log( tmplChildContent );

                                        tmplChildContent.innerHTML += partBody;  
			                break;
  			case "rcd_footer":	
                                        // Function to Replace Footer DIV tag
                			var tmplChildFooter  = doctmpl.querySelector("#rcd_footer");
                                        console.log( tmplChildFooter );
                                        tmplChildFooter.outerHTML = partBody;  
                                        break;
                        default:
                                        console.log( "none" );
				        break;
		                        }
	        } else { return "none" }  //Not in part format.     

	        } //End of find to skip or not skip part insert
	     //document.querySelector("iframe").contentWindow.highlightDIV(); //check and enable highlighting.

	     });
	     }	


function restoreZoom() {
             var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
             const tmplBody =  decodeURIComponent( localStorage.getItem("rcd_EditWindow")); 
	     //Place tmplBody in edit area.
	     txtNote.forEach ( function (comment){
		comment.innerHTML = tmplBody;     
	     });
	     
   }

// Restore last Session Save. Button top menu Session Save / Session Load
function restoreSession() {
             var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
             const tmplBody =  decodeURIComponent( localStorage.getItem("rcd_SessionSave")); 
	     //Place tmplBody in edit area.
	     txtNote.forEach ( function (comment){
		comment.innerHTML = tmplBody;     
                noticeSessLoad();
	         });
	     
    }


function saveSession() {

             var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
    
	     //Place tmplBody in edit area.
	     txtNote.forEach ( function (comment){
    
             var htmlContent = comment.innerHTML;
             const encodedString = encodeURI(htmlContent);
             localStorage.setItem('rcd_SessionSave', encodedString);
             localStorage.setItem('rcd_reload', "session");	
             noticeSessSave();
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

        activecountpart = getCookie("active_count_part") || 0;
        sess_user = getCookie("sess_user") || "";
        i=1;
	while (i <= activecount) {
        tmplsubj[i]  = localStorage.getItem('design_'+sess_user+'_tmpl_subject'+i ) || "";
        i++;
	}

        i=1;
	while (i <= activecountpart) {
        partsubj[i]  = localStorage.getItem('design_'+sess_user+'_part_subject'+i ) || "";
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

