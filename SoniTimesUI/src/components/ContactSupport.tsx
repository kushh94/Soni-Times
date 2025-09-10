import { ArrowLeft, Phone, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_INFO, WHATSAPP_TEMPLATES } from "../utils/constants";

interface ContactSupportProps {
  onBack: () => void;
}

export function ContactSupport({ onBack }: ContactSupportProps) {
  const handleCall = () => {
    window.open(`tel:${CONTACT_INFO.WHATSAPP_NUMBER}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(WHATSAPP_TEMPLATES.GENERAL_INQUIRY());
    window.open(`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-900">Help & Support</h1>
            <p className="text-sm text-gray-500">Get in touch with us</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 space-y-6">
        {/* Contact Person */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg">{CONTACT_INFO.OWNER_INITIALS}</span>
            </div>
            <div>
              <h3 className="text-lg text-gray-900">{CONTACT_INFO.OWNER_NAME}</h3>
              <p className="text-sm text-gray-500">{CONTACT_INFO.OWNER_TITLE}</p>
            </div>
          </div>
          
          {/* Phone Number */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{CONTACT_INFO.PHONE_NUMBER}</p>
                </div>
              </div>
              <button
                onClick={handleCall}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Call
              </button>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MessageCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="text-gray-900">{CONTACT_INFO.PHONE_NUMBER}</p>
                </div>
              </div>
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <MapPin size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-2">Visit Our Store</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                '{CONTACT_INFO.STORE_NAME}'<br />
                {CONTACT_INFO.STORE_ADDRESS.line1}<br />
                {CONTACT_INFO.STORE_ADDRESS.line2}<br />
                {CONTACT_INFO.STORE_ADDRESS.city}
              </p>
              <button
                onClick={() => window.open(CONTACT_INFO.STORE_LOCATION_URL, '_blank')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MapPin size={16} />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Store Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-gray-900 mb-4">Store Hours</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{CONTACT_INFO.STORE_HOURS.weekdaysLabel}</span>
              <span className="text-gray-900">{CONTACT_INFO.STORE_HOURS.weekdays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{CONTACT_INFO.STORE_HOURS.weekendLabel}</span>
              <span className="text-gray-900">{CONTACT_INFO.STORE_HOURS.weekend}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <h4 className="mb-3">Need Immediate Help?</h4>
          <p className="text-blue-100 text-sm mb-4">
            For urgent inquiries about your timepiece or immediate assistance, contact us directly.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}