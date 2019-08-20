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
    margin-bottom: 30px;

    strong {
      font-size: 32px;
      color: #fff;
    }

    ul {
      display: flex;
      align-content: space-between;
    }
  }

  aside {
    color: #fff;

    span {
      overflow: hidden;
      display: block;

      background: rgba(0, 0, 0, 0.3);
      height: 300px;
      max-height: 30vw;

      margin-bottom: 30px;
      border-radius: 4px;

      img {
        width: 100%;
      }
    }
  }

  footer {
    margin-top: 30px;

    ul {
      display: flex;
      justify-content: start;

      li {
        color: #999;
        font-size: 12px;
        display: flex;
        align-items: center;
        margin-right: 20px;

        span {
          margin-left: 4px;
        }
      }
    }
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;

  border: 0;
  border-radius: 4px;
  background: ${props => (props.blue ? '#4dbaf9' : '#f94d6a')};

  padding: 10px;
  margin: 5px 0 0 20px;
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
    background: ${props => darken(0.03, props.blue ? '#4dbaf9' : '#f94d6a')};
  }
`;

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
