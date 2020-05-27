package parser;
class Main{
  public static void main(String[] args) {
    Grammar g = new Grammar("S -> E F T\nE -> T E_\nE_ -> + E_ | - E_\nT -> 1|2|3");
    System.out.println(g);
  }
}