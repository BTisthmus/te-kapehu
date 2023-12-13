import React from 'react';
import Image from 'next/image';
import Script from 'next/script';

import {CreateTeKapehuDiagram} from '../components/CreateDiagram';
import {EditDiagram} from '../components/EditDiagram';
import {MiroSDKInit} from '../components/SDKInit';

export default function RootLayout({children}) {
  return (
    <html>
      <body>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <MiroSDKInit />
        <div id="root">
          <div className="grid">
            <div className="cs1 ce12">
              <CreateTeKapehuDiagram />
            </div> 
            <div className="cs1 ce12">
              <EditDiagram />
            </div>         
            <hr className="cs1 ce12" />
            <div className="cs1 ce12">{children}</div>
            <hr className="cs1 ce12" />
            <div className="cs1 ce12">
              <p>
                To explore more and build your own app, see the Miro Developer
                Platform documentation.
              </p>
              <a
                className="button button-secondary"
                target="_blank"
                href="https://developers.miro.com"
              >
                Read the documentation
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
