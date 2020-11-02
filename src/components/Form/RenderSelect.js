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

import React, {Component} from "react";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import i18n from "i18next";


class RenderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  handleChange(value) {
    // this is going to call setFieldValue and manually update values.fieldName
    this.props.onChange(this.props.fieldName, value);
  }

  handleBlur() {
    this.props.onBlur(this.props.fieldName, true);
  }

  render() {
    return (
      <div>
        <label htmlFor="color">
            {this.props.label} {this.props.requiredStar &&<span className="text-danger">*</span>}
        </label>
        <Select
              closeOnSelect={!this.props.stayOpen}
              multi={this.props.multi}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              options={this.props.options}
              placeholder={this.props.placeholder}
              value={this.props.value}
              noResultsText={i18n.t('noResultFound')}
          />
        {!!this.props.error &&
        this.props.touched && (
          <div style={{ 'width': '100%', 'marginTop': '0.25rem', 'fontSize': '80%', 'color': '#dc3545' }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
  }
}

export default RenderSelect;
