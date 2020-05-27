package parser;

public class Terminal extends Symbol{
  private String symbol;
  Terminal(String symbol){
    this.symbol = symbol;
  }

  @Override
  public String toString() {
    return this.symbol;
  }
}