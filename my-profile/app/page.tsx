import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-8 text-slate-800 font-sans">
      <main className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden border border-blue-100 transition-all hover:shadow-2xl hover:shadow-blue-200">
        <div className="bg-blue-600 h-32 w-full relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl border-4 border-blue-50">
              MW
            </div>
          </div>
        </div>

        <div className="pt-16 pb-12 px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">강민우</h1>
          <p className="text-blue-600 font-medium mb-6">Kang Min-woo</p>
          
          <div className="bg-blue-50 p-6 rounded-2xl w-full mb-8 border border-blue-100">
            <p className="text-lg leading-relaxed text-blue-800">
              "안녕하세요 한양대학교 컴퓨터소프트웨어학부 22학번 강민우입니다."
            </p>
          </div>

          <section className="w-full text-left mt-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              <h2 className="text-xl font-bold text-blue-900">Favorite Artist: 한로로 (HANRORO)</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed italic">
                "이 시대 청춘들의 마음을 가장 문학적인 록 사운드로 위로하는 아티스트"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-100/30 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-1">입춘 (Debut)</h3>
                  <p className="text-sm text-slate-500">추운 겨울을 지나 봄을 맞이하려는 청춘의 다짐</p>
                </div>
                <div className="bg-blue-100/30 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-1">비틀거릴지언정 뒤처지지는 마</h3>
                  <p className="text-sm text-slate-500">불안한 청춘을 향한 따뜻한 위로와 응원</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-blue-600">Genre:</span> 모던 록 (Modern Rock)<br />
                  <span className="font-bold text-blue-600">Style:</span> 서정적인 멜로디와 강렬한 밴드 사운드, 시적이고 문학적인 가사가 특징입니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-8 text-blue-400 text-sm">
        © 2024 Kang Min-woo. Built with Blue Themes.
      </footer>
    </div>
  );
}
