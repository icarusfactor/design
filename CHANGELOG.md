### v0.5.0
 - Initial version, only available for Elastic skin

### v0.6.4
 - Worked on editor specific issues
 - Added IMG tag replace in popup
 - Added Table and TD background color replace in popup.

### v0.6.7
 - Added press of Alt and CTRL keys to lower or raise popups.
                 Alt table /  CTRL link / IMG ALT+CTRL

### v0.6.8
 - This version is not only workable, but first useful and userfriendly version. 
 - Added icon for template toolbar.
 - Made bundled templates work good with the visual editors controls. 

### v0.6.9
 - Added scrolling for long dropdown menus.
 - Limited fonts to ones that are web safe for all major email clients. 
 - Template dropdown now matches theme of toolbar.
 - Added larger font sizes. 
 - Fixed Paragraph dropdown setting by setting Z-index above everything else for dropdowns.

### v0.7.0
 - Template controls for template id rcd_div
 - Added right click popup with limited options according to template. FIXED or DYNANMIC.
 - Added Drag and Drop ability of DIV tags with template div id "rcd_div"
 - Add right click popup logic for copy/paste for tagged div sections (experimental)
 - Added template ids and controls to all basic templates.
 - Updated About for specifications of template controls so anyone can make their own.
 - Added Advanced Settings to enable or disable experimental options.
 - Added version for Roundcube About. 

### v0.7.1
 - Forgot to remove the Move button from the top menu , it did nothing as I moved all of this to the right-click edit window menu.  

### v0.7.4
 - Added Toggle Zoom button ; Easier to move DIV blocks with smaller view. 
 - Added Save/Load Session buttons.
 

### v0.7.5
 - Changed CopyDiv to Duplicate DIV. Removing Copy Paste DIV and Experimental mode. 

### v0.7.8 
 - Added highlight for dynamic divs once move is enabled and removed if disabled. This makes it easy to dicern what is dynamic about the template and help understand what and where the div is being moved to.

### v0.7.9
 - Hot Fix for creating template folder. Messed it up somewhere along the way. 

### v0.8.0
 - Added part button on edit menu, this is for inserting part list items into DYNAMIC template sections.


### v0.8.2
 - Fixed Save Draft where it copied the editors div and limited height. Now only the template is copied. 
 - Added CutDIV to Dynamic menu items.
 - Brought version of all DYNAMIC templates to version 1.1
 - Added to documentation about Part container. Will be for part packs, but not used for that yet.  

### v0.8.4
 - Highlight and moving element created logic confusion leaving empty divs. Clean up empty divs left behind. 
 - Make part immutable so you cant drag  drop them into each other breaking dynamic templates. 
 - With better move functions had update Highlight off.
 - Rewrote Drag & drop, now all items work. Was issue with insertBefore, instead of using insertAdjacent. 

### v0.8.5
 - Add 3 specific Part buttons to install | Headers | Footers | Content Pull from single Parts email folder.  
 - Added two svg icons for new menu items one for header and one for footer.

### v0.8.6
 - Added more default parts 
 - Removed 10 part limit as split three catalogs for parts. Which needed more.
 - Added to Summernote menu items arrays to show up to 20 for each part type Header  / Content / Footer
 - Added two button in Settings to clear cookies and localstoage.When lots of changes are made or upgrade. Clear it all.

### v0.8.7
 - Added more default parts
 - Changed right click to say Move, Lock, Cut, Duplicate Part on Dynamic popup.
 - Added menu button for notice that document is FIXED or DYNAMIC.

### v0.8.8
 - Made icons for top buttons.  
 - Changed Theme to match RoundCube Elastic. 
 - Added Make Template button to the top menu that will move a FIXED or DYNAMIC editor page to the template directory. 
 - Added modal popup to give a name for new templates and saved to draft emails.  

### v0.8.9
 - Fix icon for smaller size to show left right instead of diagonal 
 - Make Settings Page like About and able to scroll down. Removed CSS shadow box.
 - Added custom icon image for part and template mail box folders. 
 - Added logic to control Right Click actions so errors can not be user forced. Better UI flow.
 - Add Right Click Make Part. Copies current part to part folder along with modifications. 

### v0.8.10    
 - Add Right Click menu option to make header.
 - Add Right Click menu option to make footer.

### v0.9.0
 - Seperated top menu items into same activity structure. 
 - Add Export Template to top menu to save to a local file filename.rcdt
 - Add Import Template to top menu to load from a local file filename.rcdt
 - Added icons for Import and Export device files. 
 - Added modal dialog for setting name to export template file rcdt

### v0.9.1
 - Add Right Click Export Part as local file filename.rcdp
 - Add Right Click Export Header as local file filename.rcdp
 - Add Right Click Export Footer as local file filename.rcdp
 - Add Right Click Import Part as local file filename.rcdp

### v0.9.2
 - Added logic to detect if import client part is a content header or footer part and install in correct area. 
 - Rename modals with correct names instead of default template code name. 
 - Limited console logs to minimal notification. 
 - Removed unused code and useless comments. 
 - Changed all default template files extentions to rcdt
 - Changed all default part files extentions to rcdp

### v0.9.3
 - Added Settings import to template folder via URL for rcdt files. 
 - Added Settings import to part folder via URL for part rcdp files. 
 - Remove drag class info from template files. Confuses editor when loaded in this state. 
 - Remove drag class info from part files. Will confuse editor when loaded in this state. 
 - Created Github repo for template/part files to use URL import locations.
      https://github.com/icarusfactor/designTmplPart Will have to use RAW file view as url.

### v0.9.4
 - Put any .rcdt file in plugin template directory and will be used as global default template install.
 - Put any .rcdp file in the plugin part directory and will be used as global default part install.
 - Pull name for part from TITLE IN HTMl COMMENT like TEMPLATE V1.2  
 - Made mailview function/event to change part/template folder flag to boxed/puzzle icon instead of off putting red flag. 

### v0.9.5
 - Global part installer will load multipart data from the .rcdp files. 
 - URL load multiple parts from one .rcdp file inside individual rcd_contianer tags.
 - Right-Click Export part now attaches name from file accoring of Version1.2
 - Fixed Toggle Zoom when the FIXED/DYNAMIC status was incorrect. 

