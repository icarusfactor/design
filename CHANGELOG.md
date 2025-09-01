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


