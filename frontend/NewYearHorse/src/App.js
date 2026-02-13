import React, { useState } from "react";
import { Sparkles, Share2, RotateCcw, Zap, RefreshCw } from "lucide-react";
import horseJokes from "./horsejoke.json";

function App() {
  const [name, setName] = useState("");
  const [sign, setSign] = useState("");
  const [showWish, setShowWish] = useState(false);
  const [currentWish, setCurrentWish] = useState(null);
  const [currentJoke, setCurrentJoke] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const zodiacSigns = [
    "Rat", "Ox", "Tiger", "Rabbit",
    "Dragon", "Snake", "Horse", "Goat",
    "Monkey", "Rooster", "Dog", "Pig"
  ];

  const zodiacPredictions = {
    Rat: "Those born in the Year of the Rat clash with the Grand Duke (Tai Sui) in the Year of the Horse. This indicates possible changes in career, residence, and relationships. However, change does not necessarily mean good or bad — face it bravely and you will manage well. In particular, during the 5th and 11th lunar months, take extra care to avoid physical injuries. High-risk activities such as skiing, water sports, and horseback riding should be avoided if possible.",
    Ox: "People born in the Year of the Ox enjoy favorable career luck in the Year of the Horse. There may be promotions, increased authority, or beneficial job changes. Helpful mentors or benefactors may appear in the workplace, but you should still pay attention to interpersonal relationships.",
    Tiger: "Those born in the Year of the Tiger form a harmonious combination with Tai Sui in the Year of the Horse. Overall relationships and collaborations are positive, and new partnership opportunities may arise. Although minor gossip or obstacles may occasionally appear, your efforts will ultimately bring good results and financial rewards.",
    Rabbit: "People born in the Year of the Rabbit receive the “Heavenly Happiness Peach Blossom” star — a positive romance star. Singles may meet someone suitable for a relationship. Those married or in stable relationships can convert this romantic energy into improved social connections that enhance work performance.",
    Dragon: "Those born in the Year of the Dragon have good career luck with opportunities for advancement, and benefactors may help during difficulties. However, they are prone to accidental injuries in the Year of the Horse, so high-risk activities like skiing, water sports, and horseback riding should be reduced or avoided.",
    Snake: "People born in the Year of the Snake enjoy favorable financial luck and may encounter new career opportunities. It is recommended to boldly try new things and directions. Minor health issues may occur more frequently, so strengthening physical fitness is advised to stay ready for challenges.",
    Horse: "Those born in the Year of the Horse experience their Ben Ming Nian (zodiac year / offending Tai Sui). With the support of two auspicious stars, career and wealth luck remain good. However, pay special attention to physical injuries and emotional fluctuations. During the 5th and 11th lunar months, actions such as dental cleaning, blood donation, or medical checkups may help reduce negative effects.",
    Goat: "People born in the Year of the Goat are in harmony with Tai Sui. Relationships, collaborations, and support from helpful people are all favorable, and there will be opportunities to perform well at work. Take advantage of the good fortune this year to build a strong foundation for the coming years.",
    Monkey: "For those born in the Year of the Monkey, the Year of the Horse activates the Traveling Horse star. This represents travel, business trips, studying abroad, relocation, or migration. Visiting different places is beneficial this year. With the support of the Academic (Wenchang) star, luck in learning, exams, reputation, and academic pursuits also improves.",
    Rooster: "People born in the Year of the Rooster receive the Red Matchmaker romance star, a positive love star. Singles may meet a potential partner. Those already in stable relationships may move toward marriage. Married individuals can turn this romantic energy into improved social relations that benefit career performance.",
    Dog: "Those born in the Year of the Dog form a harmonious combination with Tai Sui. Relationships and partnerships are favorable, new collaborations may appear, and there may be promotions or authority increases at work. Financial rewards will be satisfactory after hard work.",
    Pig: "PPeople born in the Year of the Pig have decent financial luck. Although expenses may also be high, overall gains remain positive. Avoid lending money to friends or business partners. Career development is also supported by helpful benefactors."
  };

  const wishesBySign = {
    Rat: "Embrace the changes ahead — every shift this year opens a new path toward growth and wisdom.",
    Ox: "Your dedication brings recognition — step forward confidently toward promotion and success.",
    Tiger: "Strong alliances and steady effort will reward you with prosperity and achievement.",
    Rabbit: "Love and harmony surround you — meaningful connections will brighten both life and work.",
    Dragon: "Progress is within reach — with support around you, obstacles will turn into opportunities.",
    Snake: "New opportunities appear — dare to explore new directions and wealth will follow.",
    Horse: "Your year shines brightly — fortune rises as long as you stay balanced in body and mind.",
    Goat: "Supportive people guide your way — build your future on this year’s strong foundation.",
    Monkey: "Movement brings luck — travel, learning, and exploration will open fortunate doors.",
    Rooster: "Romance and joyful connections flourish — happiness grows in both love and career.",
    Dog: "Partnerships bring rewards — your hard work will return with status and financial gain.",
    Pig: "Steady gains arrive — manage wisely and your efforts will turn into lasting abundance."
  };
  

  const handleSubmit = () => {
    if (!name.trim() || !sign) return;

    const randomWish  = wishesBySign[sign];
    const randomJokeObj = horseJokes[Math.floor(Math.random() * horseJokes.length)];
    const randomJoke = `${randomJokeObj.question}"\n"${randomJokeObj.answer}`;

    setCurrentWish(randomWish);
    setCurrentJoke(randomJoke);
    setShowWish(true);
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleReset = () => {
    setShowWish(false);
    setName("");
    setSign("");
  };

  const handleRefreshJoke = () => {
    const randomJokeObj = horseJokes[Math.floor(Math.random() * horseJokes.length)];
    const randomJoke = `${randomJokeObj.question}"\n"${randomJokeObj.answer}`;
    setCurrentJoke(randomJoke);
  };

  const handleShare = async () => {
    const text = `Happy Year of the Horse!\n\n${currentWish}\n\nZodiac Insight (${sign}): ${zodiacPredictions[sign]}\n\n${currentJoke}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // User cancelled share, do nothing
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: `${Math.random() * 10 + 20}px`,
              }}
            >
              {['✨', '🎊', '🎉', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-7xl relative z-10">
        {!showWish ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* LEFT SIDE - Form */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-amber-500/20 rounded-full border border-red-500/30 backdrop-blur-sm">
                  <span className="text-amber-300 text-sm font-medium tracking-wide"> YEAR OF THE HORSE 2026</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent leading-tight">
                  马年快乐
                </h1>
                
                <p className="text-2xl md:text-3xl text-slate-300 font-light">
                  Gallop into Fortune
                </p>
                
                <p className="text-slate-400 text-lg max-w-md">
                  Discover your personalized blessing and fortune for the Year of the Horse
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-6 py-4 rounded-2xl text-lg bg-slate-800/50 backdrop-blur-sm text-white border-2 border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Chinese Zodiac Sign</label>
                  <select
                    value={sign}
                    onChange={(e) => setSign(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl text-lg bg-slate-800/50 backdrop-blur-sm text-white border-2 border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">Select your zodiac sign...</option>
                    {zodiacSigns.map((z) => (
                      <option key={z} value={z} className="bg-slate-800">{z}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || !sign}
                  className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <Sparkles size={22} className="animate-pulse" />
                    <span className="text-lg">Reveal My Fortune</span>
                    <Zap size={22} className="animate-pulse" style={{animationDelay: '0.5s'}} />
                  </div>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl max-h-[700px] shadow-black/40 order-1 lg:order-2 group">
              <img
                src={process.env.PUBLIC_URL + "/horse2026.jpg"}
                alt="Year of the Horse"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-3 right-4 text-white/50 text-xs backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                Photo by Andrey Soldatov on Unsplash
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Results Grid */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Wish Card */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl max-h-[700px] shadow-black/50 border border-slate-700/30">
                <img
                  src={process.env.PUBLIC_URL + "/horse_card2.jpg"}
                  alt="Year of the Horse"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-10 h-full flex flex-col justify-start pt-12 px-8">
                  <div className="bg-white/95 backdrop-blur-sm border-l-4 border-red-600 p-7 rounded-r-lg shadow-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                      Dear {name}
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {currentWish}
                    </p>
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 text-white/60 text-xs z-20 bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  Photo by Andrey Soldatov on Unsplash
                </div>
              </div>

              {/* Zodiac + Joke */}
              <div className="space-y-6 flex flex-col">
                
                {/* Zodiac Card */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center">
                      <Sparkles className="text-white" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-amber-400">
                      {sign} Forecast
                    </h3>
                  </div>

                  <p className="text-slate-200 text-base leading-relaxed">
                    {zodiacPredictions[sign]}
                  </p>
                  
                  <div className="mt-5 pt-5 border-t border-slate-700/50">
                    <p className="text-amber-500/80 text-sm">Year of the Horse 2026</p>
                  </div>
                </div>

                {/* Joke Card */}
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-8 shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-amber-400 text-sm font-semibold tracking-wide">HORSE HUMOR</span>
                    </div>
                    <p className="text-slate-100 text-lg font-light text-center italic leading-relaxed whitespace-pre-line">
                      "{currentJoke}"
                    </p>
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={handleRefreshJoke}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 hover:border-amber-500/60 text-amber-300 text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        <RefreshCw size={16} />
                        New Joke
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm text-white font-semibold py-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Share2 size={18} className="inline mr-2" />
                    Share Your Fortune
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex-1 bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 text-slate-200 font-semibold py-4 rounded-xl shadow-lg hover:bg-slate-600/60 hover:border-slate-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <RotateCcw size={18} className="inline mr-2" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm space-y-2">
          <p className="font-light">May strength and prosperity follow you this year</p>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-10px) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fall {
          animation: fall 3s linear forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;