import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import settings from './settings.json'
import { KC_URL } from './utilities/constants';
// Containers
import Full from './containers/Full/'

// Styles
import 'simplebar/dist/simplebar.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Main styles for this application
import './scss/style.scss'
// Temp fix for reactstrap
import './scss/core/_dropdown-menu-right.scss'
import  PublicRoutes  from './containers/PublicRoutes/PublicRoutes'
import { getUserGroups, isPage401 } from "./utilities/helpers";
import Keycloak from 'keycloak-js';
import decode from 'jwt-decode'
import Base64 from 'base-64';
import Page401 from "./views/Errors/Page401";

const { clientId, realm } = settings.keycloak;

let kc = Keycloak({
	url: KC_URL,
	realm: realm,
	clientId: clientId
});

/**
 * Code below adds Keycloak functionality and redirect loggedin user to either Application or 401 Authorized Page.
 * It uses keycloak.json configuration file downloaded from Keycloak.
 */
if (window.location.href.slice(window.location.href.length - 11) === '/deviceinfo') {
	ReactDOM.render((
		<I18nextProvider i18n={i18n}>
			<HashRouter>
				<Switch>
				<Route path="/deviceinfo" render={(props) => <PublicRoutes {...props} />} />
				</Switch>
			</HashRouter>
		</I18nextProvider>
	), document.getElementById('root'));
}
else {
	kc.init({ onLoad: 'login-required',"checkLoginIframe" : false }).success(authenticated => {
		if (authenticated) {
			localStorage.setItem('token', kc.token);
			let tokenDetails = decode(kc.token)
			let groups = getUserGroups(tokenDetails);
			var pageStatus = isPage401(groups);
			if (pageStatus) { // is Page401 then show page401
				kc.loadUserInfo().success(function (userInfo) {
					ReactDOM.render((
						<I18nextProvider i18n={i18n}>
							<HashRouter>
								<Switch>
									<Route path="/" render={(props) => <Page401 kc={kc} userDetails={userInfo} {...props} />} />
								</Switch>
							</HashRouter>
						</I18nextProvider>
					), document.getElementById('root'));
				});
			} else { // User has permission and therefore, allowed to access it.
				kc.loadUserInfo().success(function (userInfo) {
					localStorage.setItem('userInfo', Base64.encode(JSON.stringify(userInfo)))
					ReactDOM.render((
						<I18nextProvider i18n={i18n}>
							<HashRouter>
								<Switch>
									<Route path="/" render={(props) => <Full kc={kc} userDetails={userInfo} resources={tokenDetails} {...props} />} />
								</Switch>
							</HashRouter>
						</I18nextProvider>
					), document.getElementById('root'));
				});
			}
		} else {
			kc.login();
		}
	}).error(function () {
		alert('Keycloak configuration issue, please refer to Keycloak Documentation');
	});
}
