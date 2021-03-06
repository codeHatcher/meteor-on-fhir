import { Table } from 'react-bootstrap';
import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Avatar from 'react-toolbox/lib/avatar';

import IconButton from 'react-toolbox/lib/button';
import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';

import { removeUserById } from '/imports/api/users/methods';

export class UserTable extends React.Component {
  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      state: {
        isAdmin: false
      },
      selected: [],
      users: Meteor.users.find().fetch()
    };

    if (Meteor.user() && Meteor.user().roles && (Meteor.user().roles[0] === 'admin')) {
      data.state.isAdmin = true;
    }

    if (Session.get('darkroomEnabled')) {
      data.style.color = 'black';
      data.style.background = 'white';
    } else {
      data.style.color = 'white';
      data.style.background = 'black';
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = 'blur(3px)';
      data.style.webkitFilter = 'blur(3px)';
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = 'blur(5px)';
    }

    //console.log("data", data);

    return data;
  }



  renderAdminControls(isAdmin, i) {
    if (isAdmin) {
      return (
        <td>
          <IconButton icon='clear' onClick={ this.removeUser.bind(this, this.data.users[i]._id) } />
        </td>
      );
    }
  }
  renderAdminHeaders(isAdmin) {
    if (isAdmin) {
      return (
        <th>Remove</th>
      );
    }
  }
  render () {

    let tableRows = [];
    for (var i = 0; i < this.data.users.length; i++) {
      tableRows.push(
      <tr key={i}>
        <td>
          <Avatar><img src={this.data.users[i].profile ? this.data.users[i].profile.avatar : '/thumbnail-blank.png' }/></Avatar>
        </td>
        <td onClick={this.routeToWeblog.bind(this, this.data.users[i]._id)} style={{cursor: 'pointer'}}>/weblog/{this.data.users[i]._id}</td>
        <td>{this.data.users[i].username}</td>
        <td>{this.data.users[i].fullName()}</td>
        <td>{this.data.users[i].emails ? this.data.users[i].emails[0].address : ''}</td>
        { this.renderAdminControls(this.data.state.isAdmin, i) }
      </tr>);
    }


    return(
      <Table responses >
        <thead>
          <tr>
            <th>Photo</th>
            <th>weblog/_id</th>
            <th>username</th>
            <th>full name</th>
            <th>email</th>
            { this.renderAdminHeaders(this.data.state.isAdmin) }
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>

    );
  }

  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }

  handleSelect(selected) {
    this.setState({selected});
  }
  routeToWeblog(userId){
    browserHistory.push('/weblog/' + userId);
  }

  removeUser(userId, event){
    event.preventDefault();
    console.log("removeUser", userId);

    removeUserById.call({
      _id: userId
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('User removed!', 'success');
      }
    });
  }
}

UserTable.propTypes = {};
ReactMixin(UserTable.prototype, ReactMeteorData);
