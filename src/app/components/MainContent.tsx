import { Search, Plus, FileText } from 'lucide-react';

export function MainContent() {
  const recentDocuments = [
    { name: 'נהלי עבודה', organization: 'ארגון א\'' },
    { name: 'דוחות שנתיים', organization: 'ארגון ב\'' },
    { name: 'מסמכי תקציב 2026', organization: 'ארגון א\'' }
  ];

  const quickAccess = [
    'מחלקת משאבי אנוש',
    'מחלקת כספים',
    'מחלקת טכנולוגיה',
    'מחלקת תפעול'
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto" dir="rtl">
      <div className="max-w-3xl mx-auto mb-12 mt-8">
        <label className="block text-sm text-gray-500 mb-2 text-right">חיפוש מסמך</label>
        <div className="relative">
          <input
            type="text"
            placeholder="הקלד שם מסמך..."
            className="w-full px-6 py-4 pr-14 bg-white shadow-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D9B8A]/50 text-right transition-all hover:shadow-xl"
            dir="rtl"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* הסביבה שלי */}
        <div>
          <h2 className="text-lg text-gray-800 mb-4 text-right">הסביבה שלי</h2>
          <div className="flex flex-wrap gap-3">
            {quickAccess.map((department, idx) => (
              <button
                key={idx}
                className="px-6 py-3 bg-[#F2F2F4] hover:bg-[#1B3A6B] hover:text-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all text-sm"
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        {/* פתחת לאחרונה */}
        <div>
          <h2 className="text-lg text-gray-800 mb-4 text-right">פתחת לאחרונה</h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-3">
              <div className="min-w-[150px] bg-transparent border-2 border-dashed border-[#D0D0D0] rounded-2xl hover:border-gray-400 transition-all p-6 cursor-pointer hover:-translate-y-0.5 duration-300 flex flex-col items-center justify-center">
                <Plus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-600">מסמך חדש</p>
              </div>

              {recentDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="min-w-[150px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer hover:-translate-y-0.5 duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <FileText className="w-8 h-8 text-[#555555]" />
                    <div>
                      <h3 className="text-gray-800 text-sm font-bold mb-1">{doc.name}</h3>
                      <p className="text-xs text-gray-400">{doc.organization}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="min-w-[150px] bg-white rounded-2xl shadow-md p-6 -ml-20 opacity-40">
                <div className="flex flex-col items-center text-center gap-3">
                  <FileText className="w-8 h-8 text-[#555555]" />
                  <div>
                    <h3 className="text-gray-800 text-sm font-bold mb-1">נהלי בטיחות</h3>
                    <p className="text-xs text-gray-400">ארגון ג'</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
