import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

// Start of Team Component
const TeamComponent = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
  overflow: auto;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  text-transform: capitalize;
  height: 40px;
  width: 40px;
  background-color: #676066;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  &:hover {
    border-style: double;
    border-width: thick;
    border-color: #737373;
  }
`;

const constructTeamView = teamObject => (
  <Link to={`/${teamObject.id}`} key={`team_${teamObject.id}`}>
    <TeamListItem title={teamObject.name}>
      {teamObject.name.charAt(0)}
    </TeamListItem>
  </Link>
);

const Teams = ({ teams }) => (
  <TeamComponent>
    <div>
      <TeamList>{teams.map(constructTeamView)}</TeamList>
      <TeamList>
        <Link to="/createTeam">
          <TeamListItem title="Create new Team">&#43;</TeamListItem>
        </Link>
      </TeamList>
      <TeamList>
        <Link to="/login">
          <TeamListItem title="Log out">
            <Icon name="log out" />
          </TeamListItem>
        </Link>
      </TeamList>
    </div>
  </TeamComponent>
);
// End of Team Component

export default Teams;
