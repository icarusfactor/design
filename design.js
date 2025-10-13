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
        var activecountpartheader = 0;
        var activecountpartcontent = 0;
        var activecountpartfooter = 0;
	var tmplsubj = new Array(10).fill(""); 
	var partheadersubj = new Array(20).fill(""); 
	var partcontentsubj = new Array(20).fill(""); 
	var partfootersubj = new Array(20).fill(""); 


document.addEventListener("DOMContentLoaded", function() { 	


     const btn_design = document.querySelector('.btn-design'); 
 
     const btn_savedraft = document.querySelector('.btn-savedraft'); 
     const btn_maketmpl = document.querySelector('.btn-maketmpl'); 

     
     const btn_tsize = document.querySelector('.btn-tsize' );
     const btn_tzoom = document.querySelector('.btn-tzoom' );

     const btn_importtmpl = document.querySelector('.btn-importtmpl' );
     const btn_exporttmpl = document.querySelector('.btn-exporttmpl' );

     const btn_savesess = document.querySelector('.btn-savesess' );
     const btn_loadsess = document.querySelector('.btn-loadsess' );
     
     const btn_designsettings = document.querySelector('.btn-designsettings'); 
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
     Dname =  draftName();	     
     draftit(Dname);	     
            });
                  }
  if (btn_maketmpl) {
     btn_maketmpl.addEventListener('click', () => { 
     Tname =  tmplPressName();	     
     tmplPressMake( Tname );	     
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
  if (btn_importtmpl) {
     btn_importtmpl.addEventListener('click', () => { 
	     //Place import function here. 
	     importCLItmpl();
            });
                  }
  if (btn_exporttmpl) {
     btn_exporttmpl.addEventListener('click', () => { 
	     //Place expormportClitmplt function here. 
	     exportCLItmpl();
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


//Takes URL from entry tag and gets rcdt file for https location.
function ImportTmplURL() {
    var URLt = document.querySelector("iframe").contentWindow.document.querySelector("#rcdtURL");	
    const URLValue = URLt.value;
    if( isValidExtUrl( URLValue ,"rcdt") ) {
    Tfname = filenameFromURL( URLValue );
    //Tdata = getFileFromURL(URLValue);
    getFileFromURL(URLValue)
    .then(Tdata => {
    if (Tdata !== null) {

    //Get title from header of template file.	    
    fc = firstHTMLComment( Tdata );  
    Tfc = gettmplTitle( fc );
    console.log("Filename:"+Tfc );	    
    if(Tfc == "false") {  Tfc = Tfname;  } 
    console.log("URL to RCDT is:" + URLValue + " File Name:"+ Tfc + " FILE DATA is:" +Tdata );
    //Next Step import filename and file data into template mail box.  	    
    const encodedName = encodeURI( Tfc );
    const encodedString = encodeURI( Tdata );
    rcmail.http_post('tmplpress', { _tn: encodedName ,_tp: encodedString} , false );
    } else {
      console.log('Failed to retrieve text from file.');
    }
    });
}
}

//Takes URL from entry tag and gets rcdp file for https location.
function ImportPartURL() {
    var URLp = document.querySelector("iframe").contentWindow.document.querySelector("#rcdpURL");	
    const URLValue = URLp.value;
    if( isValidExtUrl( URLValue ,"rcdp") ) {
    Pfname = filenameFromURL( URLValue );
    //Pdata = encodeURI( getFileFromURL(URLValue) );
    getFileFromURL(URLValue)
    .then(Pdata => {
    if (Pdata !== null) {
     
      fc = firstHTMLComment( Pdata );
      Pfc = gettmplTitle( fc );	     
      console.log("Filename:"+Pfc );	    
      if(Pfc == "false") {  Pfc = Pfname;  }
      //console.log('Text from file:', Pdata);
      console.log("URL to RCDP is:" + URLValue + " File Name:"+Pfc + " FILE DATA is:" +Pdata );
      //Next Step import filename and file data into part mail box.  	    
      localStorage.setItem("rcd_MakePart", encodeURI(Pdata) );	
      partPressMake( Pfc );
    } else {
      console.log('Failed to retrieve text from file.');
    }
    });
    }
}



function firstHTMLComment( tmplfile ) {

   // The regular expression for an HTML comment
   const regex = /<!--([\s\S]*?)-->/;
   // Use String.prototype.match() to find the first comment
   const match = tmplfile.match(regex);
   if (match) {
      //const fullComment = match[0];
      const commentContent = match[1];
      //const commentIndex = match.index;
      
      //console.log(`Full comment: ${fullComment}`);
      console.log(`Content: ${commentContent.trim()}`);
      return commentContent;
    } else {
      console.log("No HTML comments were found.");
      return null;
    }	

}


function filenameFromURL(url) {
  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const lastSlashIndex = pathname.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      return pathname.substring(lastSlashIndex + 1);
    }
    return ''; // No filename found
  } catch (error) {
    console.error("Invalid URL:", error);
    return '';
  }
}

function isValidExtUrl(url , ext) {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    
    // Get the part of the pathname after the last period.
    const extension = pathname.split('.').pop();
    
    // Return true if the extension is 'rcdp' and the URL is well-formed.
    return extension.toLowerCase() === ext;
  } catch (error) {
    // The URL constructor will throw an error for invalid URLs.
    return false;
  }
}




function gettmplTitle( str ) {

const regex = /:([^:]*)/g;
let matches = [];
let match;

while ((match = regex.exec(str)) !== null) {
  matches.push(match[1]);
}

console.log("TITLE:"+matches[0]);
if(matches[0] ){ return matches[0]; } else { return "false"; }
}



async function getFileFromURL(url) {
  try {
    const response = await fetch(url, { cache: "no-store" } );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileContent = await response.text(); // Or .json(), .blob(), .arrayBuffer() depending on the file type
    return fileContent;
  } catch (error) {
    console.error("Error fetching file:", error);
    return null; // Or handle the error as needed
  }
}


    function importCLItmpl( ) {
      var importf = document.createElement('input');
      importf.setAttribute('type' , "file");
      importf.setAttribute('accept' , ".rcdt");

      const reader = new FileReader();

      importf.type = 'file';
      importf.onchange = _ => {
            var files =   Array.from(importf.files);
	    const file = event.target.files[0];   //Get Selected file. 
	    //filetext = reader.readAsText(file); 
            //console.log(filetext);
	     if (file) {
            reader.onload = function(e) {

		               if(e.target.result !== null) {
                                  const fileContent = e.target.result;
                                  //console.log(fileContent); // Print the file content to the console
                                  //document.getElementById('output').textContent = fileContent; // Display in the <pre> tag
				  document.querySelector("iframe").contentWindow.LoadEditor(fileContent);     
				                            }  
                                        };

            reader.onerror = (errorEvent) => {console.error("Error reading file:", errorEvent); };

                                  reader.readAsText(file); // Read the file as text
                       } 

                            };
     importf.click();
    }

    function exportCLItmpl() {
      //This needs to be a modal popup for name of file entry.
      fileName = document.querySelector("iframe").contentWindow.SetExportName();     
    } 	

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

    //console.log( "ScaleY:" + scaleY );	    
    //console.log( "ScaleX:" + scaleX );	    

    if ( scaleX === 0.5) {
    var dub = comment.offsetHeight * 1.9;
    comment.style.height = String(dub) +"px";    
    //console.log("shrink");	    
    } 
    if (scaleX  === 1 ) {

    //Use local storage to save current edit window HTML and reset from screwy CSS.
    const encodedString = encodeURI(htmlContent);
    localStorage.setItem('rcd_EditWindow', encodedString);
    localStorage.setItem('rcd_reload', "zoom");

    //console.log("No Zoom");	    
    document.querySelector("iframe").contentWindow.location.reload(true);
	   
    }  });  }


    
    function draftit(draftName) {

             if(draftName !== undefined ) {
	     var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
	     txtNote.forEach ( function (comment){
		const encodedName = encodeURI(draftName);     
		const encodedString = encodeURI(comment.innerHTML);     
 	        rcmail.http_post('senddraft', { _dn: encodedName ,_message: encodedString} , false );
	     }); 
	                                 }
                                }

    function draftName() {
	     document.querySelector("iframe").contentWindow.sendDraftName();    	
	     //console.log("Template Name Will be:"+tmplName);
                       }


    function tmplPressName() {
	     document.querySelector("iframe").contentWindow.makeTemplateName();    	
	     //console.log("Template Name Will be:"+tmplName);
                       }

    function tmplPressMake( tmplName ) {

             if(tmplName !== undefined ) {
	     //console.log("Encoded Template Name :"+tmplName);
	     var txtNote = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");
	     txtNote.forEach ( function (comment){		     
             const encodedName = encodeURI( tmplName );	
	     const encodedString = encodeURI( comment.innerHTML);     
 	     rcmail.http_post('tmplpress', { _tn: encodedName ,_tp: encodedString} , false );
	     }); 
                       }
                       }

   function tmplPresExport( tmplName ) {
             //console.log( "The Template Name Will Be "+tmplName );
             if(tmplName !== undefined ) {
             let allElementsHtml = '';

             //Add file ext to end of name.
	     tmplName = tmplName+".rcdt";	     
	     var domdata = document.querySelector("iframe").contentWindow.document.querySelectorAll("div.note-editable.card-block");                     //console.log( domdata ); 
	     domdata.forEach ( function (tdata){
             //console.log( tdata.outerHTML );
             //tmpldata = tdata.innerHTML;         
             //console.log( tmpldata  );           
             tmpldata = tdata.innerHTML;         

	     //Make sure no dynamic attributes remain. 	     
             tmpldata = tmpldata.replace(/\s+draggable=(["']).*?\1/g,  '');
             tmpldata = tmpldata.replace(/\s+ondragend=(["']).*?\1/g,  '');
             tmpldata = tmpldata.replace(/\s+ondragover=(["']).*?\1/g, '');
             tmpldata = tmpldata.replace(/\s+ondragstart=(["']).*?\1/g,'');
             tmpldata = rmDragPartClass( tmpldata );  

	     console.log( "tmpldata:"+tmpldata );	     
	     //Unwanted div class and attributes should be rmeoved for templates.	     
             const file = new Blob([tmpldata], { type: 'text/html' });
             const link = document.createElement('a');
	     link.href = URL.createObjectURL(file);	     
	     //May or May not need decode	     
             link.download = decodeURI(tmplName);
	     document.body.appendChild(link);
	     link.click();
	     document.body.removeChild(link);
	     URL.revokeObjectURL(link.href);
                       });}  }	

    //need to have this not only pass the part name ,but the encoded part also. 	
    function partPressMake( partName ) {

             if(partName !== undefined ) {
             // If the console outputs the correct part data then move to encoding it and passing it to server with rcmail.http_post.
             //console.log("partPressMake:Part Name:"+partName);
	     let  partHTML = localStorage.getItem('rcd_MakePart');
             //clear value.So we dont get parts mixed up.
	     localStorage.setItem("rcd_MakePart","" );
             //now things should be in sync.		     
             //console.log("partPressMake:Part Data:"+partHTML);
             const encodedName = encodeURI( partName );	
             //partdata is already encoded.		      
 	     rcmail.http_post('partpress', { _pn: encodedName ,_pp: partHTML} , false );
	    } else { console.log("partPressMake:No Part Name found"); }
		     
	     
             }
 
//Remove drap-part from table tags to make them immutable when drag starts
function rmDragPartClass(textString) {
  const regex = /(<table[^>]*class="[^"]*)\bdrag-part\b([^"]*"[^>]*>)/g;
  return textString.replace(regex, (match, p1, p2) => {
    const rmClass = (p1 + p2).replace(/\s\s+/g, ' ').trim();
    return rmClass;
  });	
}



function exPartPressMake( partName ) {
if(partName !== undefined ) {

     let partHTML = decodeURI( localStorage.getItem('rcd_ExportPart')); 
     //clear value.So we dont get parts mixed up.
     localStorage.setItem("rcd_ExportPart","" );
     //now things should be in sync.                 
     partName = partName+".rcdp";
     const file = new Blob([partHTML], { type: 'text/html' });
     const link = document.createElement('a');
     link.href = URL.createObjectURL(file);
     //May or May not need decode            
     link.download = decodeURI(partName);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     URL.revokeObjectURL(link.href);	

     } else { console.log("partPressMake:No Part Name found"); }
     } 

     function noticeSessSave() {
	     const Bpress = "sesssave";
	     //console.log("Save Session");
 	     rcmail.http_post('sessnotice', { _button: Bpress} , false );
     }

     function noticeSessLoad() {
	     const Bpress = "sessload";
	     //console.log("Load Session");
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

     function noticeCutDIV() {
	     const Bpress = "cutdiv";
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
	     var Bpress = "";

            //switch( type ) {
            //      case "header":
	    //            Bpress = "inpartheader";
 	    //            rcmail.http_post('inpartheader', { _button: Bpress} , false );
            //            break;

            //      case "content":
	                Bpress = "inpartcontent";
 	                rcmail.http_post('inpartcontent', { _button: Bpress} , false );
            //            break;

            //      case "footer":
	    //            Bpress = "inpartfooter";
 	    //            rcmail.http_post('inpartfooter', { _button: Bpress} , false );
            //            break;
            //       default: 
	                //const Bpress = "inparts";
 	                //rcmail.http_post('inparts', { _button: Bpress} , false );
	//		break;    
           //                }
     }  

     function clearIt( type ) {

     if(type == "cookies") {
      clearAllCookies();  
     }	     

     if(type == "localstorage") {
      localStorage.clear();
     }	     
     return 1;	     
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
             //console.log( "IMPORT NUM: "+num );
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
        function importPart( num , type ) {
             //console.log( "IMPORT "+type+" NUM: "+num );
             sess_user = getCookie("sess_user") || "";
             const partBody =  decodeURIComponent( localStorage.getItem('design_'+sess_user+'_part_body'+type+num)).replace(/\+/g, " "); 
		
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
                  //console.log( PartMatch[1] );
		  
		  switch (PartMatch[1]) {
  			case "rcd_header":	
                                        // Function to Replace Header DIV tag
                			var tmplChildHeader  =  doctmpl.querySelector("#rcd_header");
                                        //console.log( tmplChildHeader );
                                        tmplChildHeader.outerHTML = partBody;  
                                        break;
  			case "rcd_div":	
                                        // Function to Insert Content as child of rcd_content
                			var tmplChildContent =  doctmpl.querySelector("#rcd_content");
                                        //console.log( tmplChildContent );

                                        tmplChildContent.innerHTML += partBody;  
			                break;
  			case "rcd_footer":	
                                        // Function to Replace Footer DIV tag
                			var tmplChildFooter  = doctmpl.querySelector("#rcd_footer");
                                        //console.log( tmplChildFooter );
                                        tmplChildFooter.outerHTML = partBody;  
                                        break;
                        default:
                                        //console.log( "none" );
				        break;
		                        }
	        } else { return "none" }  //Not in part format.     

	        } //End of find to skip or not skip part insert
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



        //From Init change part and template folder messages from the off putting red flag to boxed and active puzzle piece.
	function setRCDfolders() {

	       //Will usally be INBOX    
               const rcmail = window.rcmail;
	       const currentFolder = rcmail.env.mailbox; 
	        console.log('The user is in the folder:', currentFolder); 


        	console.log("Folder changed to: "+ currentFolder);
                const styleTag = document.getElementById('rcd_style');

		if (styleTag) {
			  console.log('The style tag with id="rcd_style" exists.');
			  //exist do nothing else here.
			  } else {
			  console.log('The style tag with id="rcd_style" does not exist.');
		          var styleElement = document.createElement('style');
		          styleElement.id = 'rcd_style';
                          document.head.appendChild(styleElement);
				 }

       if( currentFolder == "template" || currentFolder == "part") { //Add mods if folders are part of rcd. 
        styleElement.textContent = `
      .messagelist span.flagged:before {
	content: "🧩";
      }
      .messagelist span.unflagged:before {
	content: "📦";
      }
    `;
       } else { styleElement.textContent = "";  } //Clear out any modifications if not part of rcd.
    };



        //From folder change event for part and template folder messages from the offputting red flag to boxed and active puzzle piece.
	rcmail.addEventListener('selectfolder', function(evt) {
        	// The new folder name is in `evt.folder`
        	var new_folder = evt.folder;
        	// The previously selected folder name is in `evt.old`
        	var old_folder = evt.old;

        	console.log("Folder changed to: "+ new_folder);
                const styleTag = document.getElementById('rcd_style');

		if (styleTag) {
			  console.log('The style tag with id="rcd_style" exists.');
			  //exist do nothing else here.
			  } else {
			  console.log('The style tag with id="rcd_style" does not exist.');
		          var styleElement = document.createElement('style');
		          styleElement.id = 'rcd_style';
                          document.head.appendChild(styleElement);
				 }

       if( new_folder == "template" || new_folder == "part") { //Add mods if folders are part of rcd. 
        styleElement.textContent = `
      .messagelist span.flagged:before {
	content: "🧩";
      }
      .messagelist span.unflagged:before {
	content: "📦";
      }
    `;
       } else { styleElement.textContent = "";  } //Clear out any modifications if not part of rcd.
    },{ passive: true });






    rcmail.addEventListener('init', function(prop) {

	//Will usally be INBOX    
        const rcmail = window.rcmail;
	const currentFolder = rcmail.env.mailbox; 
	console.log('The user is in the folder:', currentFolder); 

	//Update folder info for RCD    
        setRCDfolders();

        //Set client values for template button.
        activecount = getCookie("active_count") || 0;

	//These are not working yet.    
        activecountpartheader = getCookie("active_count_partheader") || 0;
        activecountpartcontent = getCookie("active_count_partcontent") || 0;
        activecountpartfooter = getCookie("active_count_partfooter") || 0;

	//This needs to be for total part count.    
        // var activecountpart = getCookie("active_count_part") || 0;
        var totalcountpart = getCookie("total_count_part") || 0;

        sess_user = getCookie("sess_user") || "";

        i=1;
	while (i <= activecount) {
        tmplsubj[i]  = localStorage.getItem('design_'+sess_user+'_tmpl_subject'+i ) || "";
        i++;
	}

        i=1;
	//total Count Part    
	while (i <= totalcountpart ) {
              key_header = key_set( sess_user , "header", i );
	      //console.log("header: "+key_header );	
	      if( key_header !== "none" ) { partheadersubj[i] = key_header;}
        
	      key_content = key_set( sess_user , "content", i );
	      //console.log("content: "+key_content );	
	      if( key_content !== "none") {partcontentsubj[i] = key_content;}
              
	      key_footer = key_set( sess_user , "footer", i ); 
	      //console.log("footer: "+key_footer );	
	      if( key_footer !== "none") { partfootersubj[i] =  key_footer;} 
        i++;
	}
	 //post process and remove empty items add back inital empty.   
         partheadersubj = partheadersubj.filter(item => item !== '');
	 partheadersubj.unshift(undefined);    
         partcontentsubj = partcontentsubj.filter(item => item !== '');
	 partcontentsubj.unshift(undefined);    
         partfootersubj = partfootersubj.filter(item => item !== '');
	 partfootersubj.unshift(undefined);    

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

function key_set( user , type , currcnt) {

         var allTheKeys = Object.keys(localStorage);
         var PartKey;

         PartKey = String(allTheKeys.filter(key => key.startsWith('design_'+user+'_part_subject'+currcnt+'_'+type)) );
         //console.log( "PartKey: " + PartKey );

	 if( PartKey != "" ){
         var subjectKey = "design_"+user+"_part_subject"+currcnt;
	 return localStorage.getItem(subjectKey);
                           }
         return "none";
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

function clearAllCookies() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  }
}


