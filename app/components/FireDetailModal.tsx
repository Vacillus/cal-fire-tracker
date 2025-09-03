'use client';

interface FireData {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  timestamp: string;
  personnel: number;
  structures_threatened: number;
  evacuation_orders: boolean;
  started_date?: string;
  cause?: string;
}

interface FireDetailModalProps {
  fire: FireData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FireDetailModal({ fire, isOpen, onClose }: FireDetailModalProps) {
  if (!isOpen || !fire) return null;

  // Prevent body scroll when modal is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ pointerEvents: 'auto' }}>
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {fire.name}
                </h3>
                <div className="mt-2">
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex justify-between">
                      <span className="font-medium">County:</span> 
                      <span>{fire.county}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        fire.status === 'Active' ? 'bg-red-100 text-red-800' :
                        fire.status === 'Contained' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {fire.status}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Acres Burned:</span> 
                      <span>{fire.acres.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Containment:</span> 
                      <span>{fire.containment}%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Personnel:</span> 
                      <span>{fire.personnel.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Structures Threatened:</span> 
                      <span>{fire.structures_threatened.toLocaleString()}</span>
                    </p>
                    {fire.evacuation_orders && (
                      <p className="flex items-center text-red-600">
                        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        Evacuation Orders Active
                      </p>
                    )}
                    {fire.started_date && (
                      <p className="flex justify-between">
                        <span className="font-medium">Started:</span> 
                        <span>{fire.started_date}</span>
                      </p>
                    )}
                    {fire.cause && (
                      <p className="flex justify-between">
                        <span className="font-medium">Cause:</span> 
                        <span>{fire.cause}</span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="font-medium">Last Updated:</span> 
                      <span>{fire.timestamp}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}