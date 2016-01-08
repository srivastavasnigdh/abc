/**
Author:  Malcolm Duncan wmd@clearlearning.com

VARIABLES from API

 var EZ.MODE_PREVIEW   = "preview"; // mode showing correct answers in place
 var EZ.MODE_TEST   = "test";  // standard student mode
 var EZ.MODE_PREGRADE  = "sample";  // mode to pregrade only items answered
 var EZ.MODE_POST_TEST  = "review";  // mode to fully grade/score the object

 var EZ.id    = "";    // external identifier from EZTO
 var EZ.qid    = "";    // parent question identifier from EZTO
 var EZ.mode    = "";    // rendering mode from EZTO
 var EZ.state   = "";    // initial state from EZTO

REQUIRED FUNCTIONS to be provided by author:

 setState( theState )
  called upon instatiation by API to set the initial state
   initial state is authored in the EZTO item
   theState is a UTF-8 string - could be XML

   ALL modes listed above are required to be supported!!!

 getState()
  called by EZTO on page exit to collect the current state
   should return a UTF-8 string
    no binary data
    XML is OK

 getScore()
  called by EZTO on page exit to collect the current score
   should return an integer from 0 to 100 reprenting percentage correct
*/
var mode = "", ifraemId = "", questionId = "", mediaValue = "", instanceId = 0, shellInput = '', EZPolicy = {};
function setState(theState) {
    mode = EZ.mode;
    startApp(theState);
    
    return;
}
            
function getState() {
    /*if(mode == MODE_DESIGN){
        return $('#state_out').val();
    }else{*/
        return $('#cndOut').val();
    //}
}

function getScore() {
    /*var theVal= $('#cndOut').val();
    if (theVal != "") return("100");
    if (theVal == "") return("0");
    return theVal;*/
}

function resizeMe(height,width)	 {
    EZ.resize(width,height);
}
function getPolicy() {
    var thePolicy= EZ.policy( $('#policy_name').val() );					
    return thePolicy;
}

function startApp(theState){
	questionId = EZ.qid;
	instanceId = EZ.instanceid;
    EZ.loadMediaReferences(); 
    var mediaBase = EZ.mediaBase;
    var medias = EZ.mediaUrls;				  
    if(mode == MODE_TEST || mode == MODE_PREGRADE || mode == MODE_PREVIEW || mode == MODE_POST_TEST){
    	var mediaValue = mediaBase;
    	var mediasString = ',';
        for(var i = 0;i < medias.length;i++){
            if(medias[i] != ""){
                mediasString = mediasString + medias[i] + ',';
            }
        }
        mediaValue += mediasString;
    	shellInput = theState;
        EZPolicy.feedbackView = EZ.policy('p_posttest') == ''? 'feedback' : EZ.policy('p_posttest'); //values: feedback,score,scoreplus,none
        EZPolicy.palette = EZ.policy('p_palette');
        EZPolicy.fbIgnorecase = EZ.policy('p_fb_ignorecase');				
        EZPolicy.fbIgnoreaccents = EZ.policy('p_fb_ignoreaccents');
        EZPolicy.fbIgnorespacing = EZ.policy('p_fb_ignorespacing');
       // EZPolicy.fillBlankStrict = EZ.policy('p_fillblankstrict');
        EZPolicy.attemptNo = EZ.policy('attemptNo') == ''? 1 : EZ.policy('attemptNo'); //values: numeric, connect Policy name: "attempt No"
        
        var src = $("script[src*='ClickDragApp.js']:first");
    	var baseUrl = (src.attr("src")).substring(0,(src.attr("src")).indexOf("ClickDragApp.js"));
    	var cssLink = $("<link>");
        var cssBaseUrl = baseUrl.substring(0,baseUrl.indexOf('/js')+1);
        $("head").append(cssLink);
            cssLink.attr({
            rel: "stylesheet",
            type: "text/css",
            href: cssBaseUrl+ 'css/default.css'
       });

       $('.object-wrapper').ClickDragShell({iframe:instanceId,questionId:questionId,shellInput:shellInput,mediaValue:mediaValue,deviceMode:EZ.mode,ezPolicy:EZPolicy});
    }else if(mode == MODE_DESIGN){
    	//var qHeight = $(document).height();
    	//var qWidth = $(document).width();
    	//var qHeight = $('#' + EZ.id, parent.document).height() || $(document).height();
    	//var qWidth = $('#' + EZ.id, parent.document).width() || $(document).width();
    	var qHeight = $('#wa_ex_frameheight', parent.document).val()  || $(document).height();			//Added only for authoring call as eztest is not providing the height and width of question.
    	var qWidth = $('#wa_ex_framewidth', parent.document).val() || $(document).width();
    	//qWidth = qWidth > 800? 800 : qWidth;
		//qHeight = qHeight > 600 ? 600 : qHeight;
		
    	$('.object-wrapper').ClickDragAuthoring({questionId:questionId,inputString:theState,width:qWidth,height:qHeight,mediaBaseURL:mediaBase,mediaValue:medias,deviceMode:EZ.mode,ezPolicy:EZPolicy});
    }
}			
