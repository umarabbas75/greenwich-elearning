import React from 'react';

const Footer = () => {
  return (
    <div className="bg-publicBlue py-6">
      <div className="container">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <div className="sub-footer-left">
              <ul>
                <li>
                  <a href="#" className="text-white">
                    <span className="font-bold text-white">
                      Copyright
                      <script>document.write(new Date().getFullYear());</script>
                    </span>
                    © All Rights Reserved
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <div className="text-right">
              <p className="text-white hover:underline cursor-pointer">
                {' '}
                Powered by{' '}
                <span>
                  <a href="https://www.greenwichtc.com/" target="_blank">
                    GreenwichTC
                  </a>{' '}
                </span>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
