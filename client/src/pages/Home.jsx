import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { number, func, string, shape, arrayOf } from "prop-types";
import { Row, notification } from "antd";

import Note from "../components/Note";
import { getFile, getNotes, deleteNote } from "../state/actions/notes-actions";
import { noteShape, downloadFromUrl } from "../util";

@connect(
  ({ notes }) => ({ notes: notes.all, error: notes.error }),
  { getFile, getNotes, deleteNote },
)
export default class Home extends Component {
  static propTypes = {
    notes: arrayOf(noteShape),
    error: shape({
      msg: string,
      timestamp: number,
    }),
    getNotes: func.isRequired,
    deleteNote: func.isRequired,
    getFile: func.isRequired,
  }

  componentWillMount = async () => {
    await this.props.getNotes();
  }

  componentWillUpdate = nProps => {
    const { error: { msg, timestamp } } = nProps;
    const { error } = this.props;

    if (msg && error.timestamp !== timestamp) {
      notification.error({ message: msg });
    }
  }

  render() {
    const { notes } = this.props;

    return (
      <Row type="flex" align="bottom">
        <Helmet>
          <title>Home</title>
        </Helmet>
        {notes.length
          ? this.renderNotes(notes)
          : <Redirect to="/add" />}
      </Row>
    );
  }

  renderNotes = notes => (
    <Fragment>
      {notes.map(note => (
        <Note
          key={note.noteId}
          {...note}
          onDelete={this.handleDelete}
          onDownload={this.handleDownload}
        />
      ))}
    </Fragment>
  )

  handleDelete = evt => {
    const { id } = evt.target.dataset;
    this.props.deleteNote(id);
  }

  handleDownload = async evt => {
    const { filename } = evt.target.dataset;
    const { value: presignedURL } = await this.props.getFile(filename);

    if (presignedURL) {
      downloadFromUrl(presignedURL);
    }
  }
}
