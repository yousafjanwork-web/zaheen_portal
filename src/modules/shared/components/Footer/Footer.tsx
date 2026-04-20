import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";
import { useAuth } from "@/modules/shared/context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { t } from "@/modules/shared/i18n";

const Footer: React.FC = () => {

  const { msisdn, logout } = useAuth();

  const handleUnsubscribe = async () => {

 const serviceId =
    localStorage.getItem("activeServiceId") || "205";

    if (!msisdn) return;

    try {

      await axios.get(
        "https://subgateway.fitsworld.com.pk/zongcharging/api/unsub",
        {
          params: {
            msisdn,
            serviceId,
            unsubMethod: "CRM"
          }
        }
      );

      logout();
      alert(t("footer.unsubscribeSuccess"));

    } catch {

      alert(t("footer.unsubscribeFail"));

    }

  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-20 mt-20">

      <div className="max-w-7xl mx-auto px-4">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Logo */}
          <div>

            <img
              src={logo}
              alt="Zaheen Logo"
              className="h-10 mb-6 brightness-0 invert"
            />

            <p className="text-sm mb-6">
              {t("footer.description")}
            </p>

            <div className="flex space-x-4 text-slate-400">

              <a
                href="https://www.facebook.com/zaheenpk87"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://www.instagram.com/zaheenpk3/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.youtube.com/@zaheen-pk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Youtube size={20} />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h4 className="text-white font-bold mb-4">
              {t("footer.quickLinks")}
            </h4>

            <ul className="space-y-2 text-sm">

              <li><a href="/grade-view/k-12">{t("footer.k12")}</a></li>
              <li><a href="/skills/300">{t("footer.prof")}</a></li>
              <li><a href="/practice">{t("footer.worksheet")}</a></li>
              <li><a href="/ai">{t("footer.ai")}</a></li>

            </ul>

          </div>

          {/* Support */}
          <div>

            <h4 className="text-white font-bold mb-4">
              {t("footer.support")}
            </h4>

            <ul className="space-y-2 text-sm">

              {msisdn && (
                <li>
                  <button
                    onClick={handleUnsubscribe}
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    {t("footer.unsubscribe")}
                  </button>
                </li>
              )}

              <li>
                <Link to="/privacy" className="hover:text-white">
                  {t("footer.privacy")}
                </Link>
              </li>

              <li>
                <Link to="/terms" className="hover:text-white">
                  {t("footer.terms")}
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h4 className="text-white font-bold mb-4">
              {t("footer.contact")}
            </h4>

            <ul className="space-y-3 text-sm">

              <li className="flex items-center gap-2">
                <Mail size={16} />
                support@zaheen.com.pk
              </li>

              <li className="flex items-center gap-2">
                <Phone size={16} />
                +92 311 14 44 974
              </li>

              <li className="flex items-center gap-2">
                <MapPin size={16} />
                {t("footer.country")}
              </li>

            </ul>

          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 text-sm text-center">
          {t("footer.copyright")}
        </div>

      </div>

    </footer>
  );
};

export default Footer;