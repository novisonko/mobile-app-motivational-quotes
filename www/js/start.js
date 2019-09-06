/**
How to make Free edition:
Set last content reference in: processContent.js > removeLoadedHtml
change class of data-role="content" to isFree in index.html
uncomment free info in page_0_about, content_0.js
remove extra html files in model/html/
remove last unlock reference in content object (content_x.js)
**/

app.init();

// debug mode
app.debug= false;

// application reference
app.appRef= 'motiv1';

// style
app.styleRef= 'style1';

// language
app.lang= 'en';

// extra templates
app.templates.page_1= app.homeDir + 'view/page_1_template2.html';

// templates
app.quizTemplate= 'page_13_quiz';
app.getUsernameTemplate= 'page_11_get_username';
app.resetPasswordTemplate= 'page_10_reset_password';
app.loginTemplate= 'page_10_login';
app.registerTemplate= 'page_10_register';

// minimum score to unlock pages
app.unlockScore= 60;

// screen sizes
app.smallscreen= 549;

app.storage.init();
app.history.init();
app.user.init();
app.hasStorage= false;
// default value for continue link
app.continueTo= '#index';

app.currentPage= 'index';
app.pageTemplate= 'index';
app.contentSourceId= 0;

// approximative time difference with server
app.serverTimeDiff= 0;

app.masterKey= 'Lsdc$64dUkjbeO5!d_';
app.apiKey= app.storage.get('apiKey') || 'xL%f89hjh665j5dfs68s_df5$d$+';
app.serverUrl= app.storage.get('appServerUrl') || 'https://apps1.hugologic.com/spring-mobile/';
app.appName= '777Q';
app.slogan= '7 hours to learn 77 motivational quotes';

// Get settings from server
app.getServerSettings();
