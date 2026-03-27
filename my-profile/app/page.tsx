import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans p-4 sm:p-8 md:p-12 lg:p-16 flex justify-center selection:bg-black selection:text-[#FFDF00]">
      <div className="w-full max-w-6xl flex flex-col gap-8 md:gap-12">
        
        {/* Header / Hero Section */}
        <header className="w-full border-4 border-black bg-[#FFDF00] p-8 md:p-16 lg:p-24 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start transition-transform hover:-translate-y-1 hover:shadow-[12px_16px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
            Kang<br className="md:hidden" /> Min-Woo
          </h1>
          <div className="bg-black text-white px-4 py-2 md:px-6 md:py-3 transform -rotate-2 border-2 border-black">
            <p className="text-lg md:text-3xl font-bold uppercase tracking-wide">
              Software Engineer / Hanyang Univ
            </p>
          </div>
        </header>

        {/* Intro Section */}
        <section className="w-full border-4 border-black bg-[#4D4DFF] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight md:leading-snug">
            안녕하세요.<br />
            한양대학교 컴퓨터소프트웨어학부<br />
            <span className="bg-[#FF49CE] text-black px-3 py-1 md:px-4 md:py-2 inline-block mt-4 border-4 border-black rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              22학번 강민우입니다.
            </span>
          </p>
        </section>

        {/* Favorite Artist Section */}
        <section className="w-full flex flex-col gap-6 md:gap-8 mt-4 md:mt-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter border-b-8 border-black pb-2 inline-block">
              Favorite Artist
            </h2>
            <div className="bg-[#00E5FF] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xl md:text-2xl transform rotate-2 self-start md:self-auto">
              한로로 (HANRORO)
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl md:text-3xl font-bold italic leading-relaxed">
               "이 시대 청춘들의 마음을 가장 문학적인 록 사운드로 위로하는 아티스트"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Song 1 */}
            <div className="border-4 border-black bg-[#FF90E8] p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
              <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-center gap-3">
                <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-black shrink-0 border-2 border-white"></span>
                입춘 (Debut)
              </h3>
              <p className="text-lg md:text-xl font-bold leading-relaxed">
                추운 겨울을 지나 봄을 맞이하려는 청춘의 다짐
              </p>
            </div>

            {/* Song 2 */}
            <div className="border-4 border-black bg-[#00E5FF] p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
              <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-start gap-3">
                <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-black shrink-0 border-2 border-white mt-1.5"></span>
                비틀거릴지언정<br className="md:hidden" /> 뒤처지지는 마
              </h3>
              <p className="text-lg md:text-xl font-bold leading-relaxed">
                불안한 청춘을 향한 따뜻한 위로와 응원
              </p>
            </div>

            {/* Genre & Style */}
            <div className="border-4 border-black bg-black text-white p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center gap-6 md:col-span-2 lg:col-span-1">
              <div>
                <span className="bg-[#FFDF00] text-black font-black px-3 py-1 text-sm md:text-base uppercase border-2 border-black inline-block -rotate-1">Genre</span>
                <p className="text-xl md:text-2xl font-bold mt-3">모던 록 (Modern Rock)</p>
              </div>
              <div className="h-1 w-full bg-white/30 rounded-full"></div>
              <div>
                <span className="bg-[#FFDF00] text-black font-black px-3 py-1 text-sm md:text-base uppercase border-2 border-black inline-block rotate-1">Style</span>
                <p className="text-lg md:text-xl font-bold mt-3 leading-relaxed">
                  서정적인 멜로디와 강렬한 밴드 사운드, 시적이고 문학적인 가사가 특징입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 md:mt-16 border-t-8 border-black pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 font-bold text-lg md:text-xl">
          <span className="bg-white px-2 py-1 border-2 border-black">© 2024 Kang Min-woo.</span>
          <span className="bg-[#FF49CE] text-black px-4 py-2 border-4 border-black transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Neobrutalism Edition
          </span>
        </footer>

      </div>
    </div>
  );
}
