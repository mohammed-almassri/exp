package parser;

public class NonTerminal extends Symbol{
  private String symbol;
  NonTerminal(String symbol){
    this.symbol = symbol;
  }

  @Override
  public String toString() {
    return this.symbol;
  }
}