import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 50px auto;

  header {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: space-between;

    button {
      display: flex;
      align-items: center;
      justify-content: space-around;

      border: 0;
      background: #f94d6a;
      border-radius: 4px;

      padding: 10px;
      margin: 5px 0 0;
      height: 36px;

      transition: background 0.2s;

      span {
        font-weight: bold;
        color: #fff;
        font-size: 14px;
        margin: 0 10px;
        align-self: center;
      }

      &:hover {
        background: ${darken(0.03, '#F94D6A')};
      }
    }

    strong {
      font-size: 32px;
      color: #fff;
    }
  }

  ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    margin-top: 30px;
  }
`;

export const Meetup = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(0, 0, 0, 0.3);
  border: 0;
  border-radius: 4px;
  height: 62px;
  padding: 0 15px;

  opacity: ${props => (props.past ? 0.6 : 1)};

  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  strong {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }

  span {
    display: flex;
    color: #999;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;

    button {
      background: none;
      border: none;
      margin-left: 20px;
      color: #fff;

      transition: color 0.2s;

      &:hover {
        color: #f94d6a;
      }
    }
  }
`;
