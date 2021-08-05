//Here, we will import the process module, one of Node's core modules
//We will use a number of functions within it as our application start's up
const process = require('process');



// Here, I decide to make a simple array, just to store some values
// so we can handle some basic languages

// In the real world we would handle this in a better way, but here
// I demonstate a simple way of using collections to add some variety to
// our application.


// Lets set up some messages in different languages
const STRING_DATA_COLLECTION_EN =
	{
	StartupMessage: "Starting our Application",
	WaitMessage: "Please wait...",
	RecievedSignal: "Received",
	}

const STRING_DATA_COLLECTION_FR =
	{
	StartupMessage: "Démarrage de l'application",
	WaitMessage: "S'il vous plaît, attendez",
	RecievedSignal: "A reçu"

	}

const STRING_DATA_COLLECTION_SP =
	{
	StartupMessage: "Aplicación inicial",
	WaitMessage: "Espere por favor",
	RecievedSignal: "Señal recibida"
	}

const STRING_DATA_COLLECTION_PT =
	{
	StartupMessage: "Aplicativo inicial",
	WaitMessage: "Por favor, espere",
	RecievedSignal: "Sinal recebido"
	}

const STRING_DATA_COLLECTION_TK =
	{
	StartupMessage: "Uygulamanın Başlatılması",
	WaitMessage: "Lütfen bekle",
	RecievedSignal: "alınan sinyal"
	}

const STRING_DATA_COLLECTION_JP =
	{
	StartupMessage: "アプリケーションの開始",
	WaitMessage: "お待ちください",
	RecievedSignal: "受信信号"
	}

const STRING_DATA_COLLECTION_SK =
	{
	StartupMessage: "Spustenie aplikácie",
	WaitMessage: "Prosím čakajte...",
	RecievedSignal: "Prijaté"
	}

// As you can imagine, in a really big application, managing languages
// like that would be a bad idea. We would load it from translation files. 
// But the concept is the same. 

// Here, I just define which one I want to be the default for me. I choose english
// This way, the system always has a default language set
const STRING_DATA_COLLECTION_DEFAULT = STRING_DATA_COLLECTION_EN

// The collection our program will actually use, which is mostly undefined until we define it
// I intend to have it overwritten a bit later in the application startup process
var STRING_DATA_COLLECTION =
	{
	StartupMessage: undefined
	}

// make a function to change the language
// With it I can change the language any time
function setLanguage(LanguageCollectionToUse)
	{
	// We change the language by overwriting the active one with the one chosen
	STRING_DATA_COLLECTION = LanguageCollectionToUse
	}


// this will let me go back to the default langauge when I want
function setDefaultLangauge()
	{
	// We call setLangauge using the the chosen default language
	setLanguage(STRING_DATA_COLLECTION_DEFAULT)
	}


// here, I set the language to the one I want using the function above
setDefaultLangauge()
// now we can display messages using getMsg("somekey") and if it exists
// in the collection, great, if not, it will return undefined


// Make a getMsg function that takes a 'Key' and returns its value from the collection
// We will use this to get messages from the collection
function getMsg(key)
	{
	return STRING_DATA_COLLECTION[key];
	}

// Lets display our startup message, but in our chosen language
console.log(getMsg("StartupMessage"));
console.log(getMsg("WaitMessage"));

// Begin reading from stdin so the process does not exit.
// This is a common trick to prevent our application terminating.
process.stdin.resume();

// Here, we attach to the SIGINT event, this is a low operating system
// level event common on UNIX like platforms and emulated on others. 
// It is sent to programs by the operating system when the program is 
// asked to 'close' or is about to 'terminate'. 
// This could be because the user asked it to exit, or because it is
// being asked to 'force close' for some reason by the OS. 
process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`${getMsg("RecievedSignal")} ${signal}`);
}


// Here we attach to others and send their output to the above function
process.on('SIGINT', handle);
process.on('SIGTERM', handle);
process.on('SIGHUP', handle);

// This one is useful, because it lets us detect when the 'terminal' window
// is 'resized' on most platforms (but not all)
process.on('SIGWINCH', handle);

process.stdout.on('resize', () => {
	console.log('screen size has changed!');
	console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});

// I create an object called application, just to represent a simple application
// I am implementing it here, but it will not execute until I have created an
// 'instance of it'
class Application
	{
	// When all node applications start, the paramater list
	// will always have an ExecutablePath, but may, or maynot have Command Line Arguments
	constructor(ExecutablePath = undefined, CommandLineArguments = undefined)
		{
			console.log('Arguments:');
			console.log(CommandLineArguments);
			for(let i = 0; i < CommandLineArguments.length; i++){
				switch(CommandLineArguments[i]){
					case 'JP': 
						setLanguage(STRING_DATA_COLLECTION_JP);
						break;
					case 'FR': 
						setLanguage(STRING_DATA_COLLECTION_FR);
						break;
					case 'EN': 
						setLanguage(STRING_DATA_COLLECTION_EN);
						break;
					case 'TK': 
						setLanguage(STRING_DATA_COLLECTION_TK);
						break;
					case 'SK': 
						setLanguage(STRING_DATA_COLLECTION_SK);
						break;
					case 'PT': 
						setLanguage(STRING_DATA_COLLECTION_PT);
						break;	
					case 'SP': 
						setLanguage(STRING_DATA_COLLECTION_SP);
						break;
					case 'showArch': 
						console.log(`Architecture: ${process.arch}`);
						break;
					case 'showOs': 
						console.log(`OS: ${process.platform}`);
						break;
					case 'changeFolder': 
						console.log(`Change folder to ${CommandLineArguments[i+1]}`);
						try {
							process.chdir(CommandLineArguments[i+1]);
							console.log(`New directory: ${process.cwd()}`);
						  } catch (err) {
							console.error(`chdir: ${err}`);
						  }
						i++;
						break;
					case 'screenSize': 
						console.log(`Screen size: ${process.stdout.columns}x${process.stdout.rows}`);
						break;
					default:
						console.log("Command not found");
				}
			}
		}
	}

// The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched. 
// The first element will be process.execPath. 
// See process.argv0 if access to the original value of argv[0] is needed. The value can change if different node programs call other
// node programs, such as, this program, calls that program. 
// The second element will be the path to the JavaScript file being executed. 
// The remaining elements will be any additional command-line arguments.
let args = process.argv.slice(2, process.argv.length);

let ourApplication = new Application(process.argv0, args);
	//process.argv
	// with "" you can make a log arg with space
	// if(process.argv.length > 2){
	// 	if(process.argv[2] === "--h"){
	// 		console.log("helper");
	// 	}
	// }